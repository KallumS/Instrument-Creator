// Headless JSFX instrument renderer: MIDI events in -> raw float32 stereo out.
// usage: render fx.jsfx out.f32 srate seconds events.txt [slider=value ...]
// events.txt: one event per line, "time_seconds status data1 data2" (decimal).
#include "ysfx.h"
#include <cstdio>
#include <cstdlib>
#include <vector>
#include <chrono>
#include <cmath>
#include <algorithm>
struct Ev { double t; uint8_t b[3]; };
static void logr(intptr_t, ysfx_log_level l, const char *m){ fprintf(stderr,"[%s] %s\n", ysfx_log_level_string(l), m); }
int main(int argc,char**argv){
  if(argc<6){fprintf(stderr,"usage: render fx out srate seconds events [k=v...]\n");return 1;}
  ysfx_config_t*c=ysfx_config_new(); ysfx_set_log_reporter(c,&logr);
  ysfx_guess_file_roots(c, argv[1]);
  ysfx_t*fx=ysfx_new(c); ysfx_config_free(c);
  if(!ysfx_load_file(fx,argv[1],0)){fprintf(stderr,"load failed\n");return 2;}
  if(!ysfx_compile(fx,ysfx_compile_no_gfx)){fprintf(stderr,"compile failed\n");return 3;}
  double sr=atof(argv[3]); double secs=atof(argv[4]);
  ysfx_set_sample_rate(fx,sr); ysfx_set_block_size(fx,256);
  ysfx_init(fx);
  for(int i=6;i<argc;i++){ int idx; double v; if(sscanf(argv[i],"%d=%lf",&idx,&v)==2) ysfx_slider_set_value(fx,idx-1,v,true); }
  std::vector<Ev> evs; FILE*fe=fopen(argv[5],"r");
  if(fe){ double t; int a,b,d; while(fscanf(fe,"%lf %d %d %d",&t,&a,&b,&d)==4){ Ev e; e.t=t; e.b[0]=a; e.b[1]=b; e.b[2]=d; evs.push_back(e);} fclose(fe); }
  std::sort(evs.begin(),evs.end(),[](const Ev&x,const Ev&y){return x.t<y.t;});
  size_t frames=(size_t)(secs*sr); std::vector<float> out(frames*2);
  const int B=256; float z[B]={0}, ol[B], orr[B];
  size_t ei=0, bad=0;
  auto t0=std::chrono::steady_clock::now();
  for(size_t p=0;p<frames;p+=B){ int m=(int)std::min((size_t)B,frames-p);
    while(ei<evs.size() && evs[ei].t*sr < p+m){
      ysfx_midi_event_t me; me.bus=0; me.offset=(uint32_t)std::max(0.0, evs[ei].t*sr - p); me.size=3; me.data=evs[ei].b;
      ysfx_send_midi(fx,&me); ei++; }
    const float*ins[2]={z,z}; float*outs[2]={ol,orr};
    ysfx_process_float(fx,ins,outs,2,2,m);
    ysfx_midi_event_t mo; while(ysfx_receive_midi(fx,&mo)){}
    for(int k=0;k<m;k++){ if(!std::isfinite(ol[k])||!std::isfinite(orr[k])) bad++; out[2*(p+k)]=ol[k]; out[2*(p+k)+1]=orr[k]; }
  }
  double el=std::chrono::duration<double>(std::chrono::steady_clock::now()-t0).count();
  FILE*fo=fopen(argv[2],"wb"); fwrite(out.data(),sizeof(float),out.size(),fo); fclose(fo);
  fprintf(stderr,"rendered %.2fs audio in %.3fs (%.1f%% realtime CPU), nonfinite=%zu\n", frames/sr, el, 100.0*el/(frames/sr), bad);
  ysfx_free(fx); return bad?5:0;
}
