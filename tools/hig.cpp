// Drive the @gfx window with the keyboard and the mouse, and measure it, for
// the checks in tools/hig_check.py (ADR 0023). Without REAPER.
// usage: hig fx.jsfx width height step...   (SHOT_SCALE=2 for Retina)
// Steps (each prints what it measures, one line per fact):
//   frame[=n]           run n frames (default 1) with the mouse where it is
//   mouse=x,y[,b[,mods[,wheel]]]   move the mouse (b: 1 left; mods: 1 shift) and run a frame
//   key=NAME[,shift]    press tab, ret, space, esc, left, right, up, down, del or bs, run a frame
//   menu=n              every menu from now on answers item n (0 = none); menus are printed
//   set=name,value      write a plugin variable;  slider=i,value  set slider i (1-based)
//   note                play C4 for a second of audio (and keep it held)
//   vars=a,b,...        print variables
//   focus               print the focus list: "focus <id> x y w h", then "focused <id>"
//   audit               draw one frame without words and print, per string,
//                       "text r g b x y w h worst" (worst = lowest contrast with
//                       any pixel under it; the words' own pixels are left out)
//   sliders             print the 23 sliders
//   png=file.bgra       write the frame's pixels
//   roundtrip           save the state, load it into a fresh instance, print its ui_zoom and calm
#include "ysfx.h"
#include <cmath>
#include <cstdio>
#include <cstdlib>
#include <cstring>
#include <string>
#include <vector>
static void logr(intptr_t, ysfx_log_level l, const char *m){ fprintf(stderr,"[%s] %s\n", ysfx_log_level_string(l), m); }
static int menu_pick = 0;
static int32_t menu(void*, const char*m, int32_t, int32_t){ printf("menu %s\n", m); return menu_pick; }
static double lin(double c){ return c <= 0.03928 ? c/12.92 : pow((c + 0.055)/1.055, 2.4); }
static double lum(double r, double g, double b){ return 0.2126*lin(r) + 0.7152*lin(g) + 0.0722*lin(b); }
static ysfx_t *load(const char *path){
  ysfx_config_t*c=ysfx_config_new(); ysfx_set_log_reporter(c,&logr);
  ysfx_guess_file_roots(c, path);
  ysfx_t*fx=ysfx_new(c); ysfx_config_free(c);
  if(!ysfx_load_file(fx,path,0)||!ysfx_compile(fx,0)){fprintf(stderr,"load/compile failed\n"); exit(2);}
  ysfx_set_sample_rate(fx,48000); ysfx_set_block_size(fx,256); ysfx_init(fx);
  return fx;
}
int main(int argc,char**argv){
  if(argc<4){fprintf(stderr,"usage\n");return 1;}
  ysfx_t*fx=load(argv[1]);
  int w=atoi(argv[2]), h=atoi(argv[3]);
  float z[256]={0}, o1[256], o2[256];
  auto block=[&](){ const float*ins[2]={z,z}; float*outs[2]={o1,o2}; ysfx_process_float(fx,ins,outs,2,2,256); ysfx_midi_event_t mo; while(ysfx_receive_midi(fx,&mo)){} };
  for(int b=0;b<20;b++) block();
  std::vector<uint8_t> px((size_t)w*h*4, 0);
  ysfx_gfx_config_t gc{}; gc.pixel_width=w; gc.pixel_height=h; gc.pixel_stride=4*w; gc.pixels=px.data();
  gc.scale_factor=getenv("SHOT_SCALE")?atof(getenv("SHOT_SCALE")):1.0; gc.show_menu=&menu;
  ysfx_gfx_setup(fx,&gc);
  ysfx_gfx_set_window_state(fx,true,true,true);
  int mx=-1,my=-1,mb=0,mm=0; double mw=0;
  auto frame=[&](){ ysfx_gfx_update_mouse(fx,mm,mx,my,mb,mw,0); mw=0; ysfx_gfx_run(fx); block(); };
  auto var=[&](const char*n)->ysfx_real*{ ysfx_real*v=ysfx_find_var(fx,n); if(!v){fprintf(stderr,"no variable %s\n",n); exit(4);} return v; };
  for(int i=4;i<argc;i++){
    std::string a=argv[i], k=a.substr(0,a.find('=')), v=a.find('=')==std::string::npos?"":a.substr(a.find('=')+1);
    if(k=="frame"){ int n=v.empty()?1:atoi(v.c_str()); while(n--) frame(); }
    else if(k=="mouse"){ mb=0; mm=0; mw=0; sscanf(v.c_str(),"%d,%d,%d,%d,%lf",&mx,&my,&mb,&mm,&mw); frame(); }
    else if(k=="key"){
      std::string nm=v.substr(0,v.find(',')); bool sh=v.find(",shift")!=std::string::npos;
      uint32_t c = nm=="tab"?9 : nm=="ret"?13 : nm=="space"?32 : nm=="esc"?27 : nm=="bs"?8 :
                   nm=="left"?ysfx_key_left : nm=="right"?ysfx_key_right : nm=="up"?ysfx_key_up :
                   nm=="down"?ysfx_key_down : nm=="del"?ysfx_key_delete : 0;
      if(!c){fprintf(stderr,"unknown key %s\n",nm.c_str()); return 5;}
      mm = sh ? ysfx_mod_shift : 0;
      ysfx_gfx_add_key(fx, mm, c, true); frame(); ysfx_gfx_add_key(fx, mm, c, false); mm=0;
    }
    else if(k=="menu") menu_pick=atoi(v.c_str());
    else if(k=="set"){ std::string n=v.substr(0,v.find(',')); *var(n.c_str())=atof(v.substr(v.find(',')+1).c_str()); }
    else if(k=="slider"){ int s; double x; sscanf(v.c_str(),"%d,%lf",&s,&x); ysfx_slider_set_value(fx,s-1,x,true); block(); }
    else if(k=="note"){ uint8_t on[3]={0x90,60,100}; ysfx_midi_event_t me; me.bus=0; me.offset=0; me.size=3; me.data=on; ysfx_send_midi(fx,&me); for(int b=0;b<190;b++) block(); }
    else if(k=="vars"){ size_t p=0; while(p<=v.size()){ size_t q=v.find(',',p); if(q==std::string::npos) q=v.size(); std::string n=v.substr(p,q-p); printf("var %s %g\n", n.c_str(), *var(n.c_str())); p=q+1; } }
    else if(k=="sliders"){ printf("sliders"); for(int s=1;s<=23;s++) printf(" %g", ysfx_slider_get_value(fx,s-1)); printf("\n"); }
    else if(k=="focus"){
      int n=(int)*var("fl_n"); double base=*var("FOCUS_TAB");
      for(int j=0;j<n;j++){ ysfx_real e[5]; ysfx_read_vmem(fx,(uint32_t)(base+j*5),e,5); printf("focus %g %g %g %g %g\n",e[0],e[1],e[2],e[3],e[4]); }
      printf("focused %g\n", *var("focus_id"));
    }
    else if(k=="audit"){
      *var("hig_audit")=1; *var("hig_notext")=1; frame(); *var("hig_audit")=0; *var("hig_notext")=0;
      double base=*var("HIG_TXT"); int n=(int)ysfx_read_vmem_single(fx,(uint32_t)base);
      for(int j=0;j<n;j++){
        ysfx_real e[8]; ysfx_read_vmem(fx,(uint32_t)(base+1+j*8),e,8);
        double lt=lum(e[0],e[1],e[2]), worst=1e9;
        int x0=(int)floor(e[3]), y0=(int)floor(e[4]), x1=(int)ceil(e[3]+e[5]), y1=(int)ceil(e[4]+e[6]);
        for(int y=std::max(0,y0);y<std::min(h,y1);y++) for(int x=std::max(0,x0);x<std::min(w,x1);x++){
          const uint8_t*p=&px[((size_t)y*w+x)*4];
          double lp=lum(p[2]/255.0,p[1]/255.0,p[0]/255.0);
          double c=(std::max(lt,lp)+0.05)/(std::min(lt,lp)+0.05); if(c<worst) worst=c;
        }
        printf("text %.3f %.3f %.3f %g %g %g %g %.2f\n",e[0],e[1],e[2],e[3],e[4],e[5],e[6],worst);
      }
      printf("scale %g\n", *var("gsc"));
    }
    else if(k=="png"){ FILE*fo=fopen(v.c_str(),"wb"); fwrite(px.data(),1,px.size(),fo); fclose(fo); }
    else if(k=="roundtrip"){
      ysfx_state_t*st=ysfx_save_state(fx);
      ysfx_t*fx2=load(argv[1]); ysfx_load_state(fx2,st); ysfx_state_free(st);
      printf("restored ui_zoom %g calm %g\n", *ysfx_find_var(fx2,"ui_zoom"), *ysfx_find_var(fx2,"calm"));
      ysfx_free(fx2);
    }
    else { fprintf(stderr,"unknown step %s\n",a.c_str()); return 6; }
  }
  ysfx_free(fx); return 0;
}
