//
//  VideoPlayerViewManager.m
//  HudleVideoPlayer
//
//  Created by Tanaka Mazivanhanga on 10/16/20.
//

#import "React/RCTViewManager.h"
@interface RCT_EXTERN_MODULE(VideoPlayerViewManager, RCTViewManager)
RCT_EXPORT_VIEW_PROPERTY(url, NSString)
RCT_EXPORT_VIEW_PROPERTY(videoName,NSString)
RCT_EXPORT_VIEW_PROPERTY(thumbnailUrl,NSString)
RCT_EXPORT_VIEW_PROPERTY(onPlayerUpdate, RCTDirectEventBlock)
RCT_EXTERN_METHOD(playFromManager:(nonnull NSNumber *)node)
RCT_EXTERN_METHOD(pauseFromManager:(nonnull NSNumber *)node)
RCT_EXTERN_METHOD(goForwardFiveFromManager:(nonnull NSNumber *)node)
RCT_EXTERN_METHOD(goBackFiveFromManager:(nonnull NSNumber *)node)
RCT_EXTERN_METHOD(seekToFromManager:(nonnull NSNumber *)node
                  seconds: (nonnull NSNumber *)seconds)



@end
