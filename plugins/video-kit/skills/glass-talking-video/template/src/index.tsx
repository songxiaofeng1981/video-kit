import React from 'react';
import {registerRoot, Composition, staticFile, type CalculateMetadataFunction} from 'remotion';
import {getVideoMetadata} from '@remotion/media-utils';
import {content} from './content';
import {Demo,GlassStudy,FPS,buildTimeline,parseSrt,type Props} from './video';
// 加载时读视频长度和字幕，按 content.ts 算出每个镜头的时间；whole=false 只取第一个镜头
const load=(whole:boolean):CalculateMetadataFunction<Props>=>async()=>{
	const {durationInSeconds}=await getVideoMetadata(staticFile(content.video));
	const videoFrames=Math.max(1,Math.floor(durationInSeconds*FPS));
	const timeline=buildTimeline(videoFrames);
	let subs:Props['subs']=[];
	if(content.subtitles){
		const res=await fetch(staticFile(content.subtitles));
		if(!res.ok) throw new Error(`content.ts 需要修改：找不到字幕文件 public/${content.subtitles}`);
		subs=parseSrt(await res.text());
	}
	const last=timeline[timeline.length-1];
	return {durationInFrames:whole?last.from+last.frames:timeline[0].frames,props:{videoFrames,timeline,subs}};
};
const empty:Props={videoFrames:1,timeline:[],subs:[]};
const Root=()=> <><Composition id="V2-Glass-and-Canvas" component={Demo} durationInFrames={30} fps={FPS} width={1080} height={1920} defaultProps={empty} calculateMetadata={load(true)}/><Composition id="Glass-Card-Study" component={GlassStudy} durationInFrames={30} fps={FPS} width={1080} height={1920} defaultProps={empty} calculateMetadata={load(false)}/></>;
registerRoot(Root);
