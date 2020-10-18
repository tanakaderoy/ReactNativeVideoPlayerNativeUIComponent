//
//  VideoPlayerView.swift
//  HudleVideoPlayer
//
//  Created by Tanaka Mazivanhanga on 10/16/20.
//

import UIKit
import AVFoundation
import MediaPlayer


class VideoPlayerView: UIView {
  // Define Now Playing Info
  var nowPlayingInfo = [String : Any]()
  var player: AVPlayer?
  var playerLayer:  AVPlayerLayer!
  var playerContainerView: UIView!
  var hasEnded = false
  @objc var isVideoPlaying: NSNumber = 0

  var name = ""
  @objc var videoName: NSString = ""{
    didSet {
      name = videoName as String
    }
  }

  @objc var thumbnailUrl: NSString = ""{
    didSet {
      setUpNowPlayingWithThumbnail()
    }
  }
  @objc var url: NSString = "" {
    didSet {
      print(url)
      playVideo(url)
    }
  }
  @objc var onPlayerUpdate: RCTDirectEventBlock?
  @objc var maximumSliderValue: NSNumber = 0
  @objc var sliderValue: NSNumber = 0
  @objc var minimumValue:NSNumber = 0

  @objc var duration: NSString = ""
  @objc var currentPlayerTime: NSString = ""

  override init(frame: CGRect) {
    super.init(frame: frame)
    commoninit()
  }


  required init?(coder aDecoder: NSCoder) {
    fatalError("init(coder:) has not been implemented")
  }

  fileprivate func setUpAudioSession() {
    do {
      try AVAudioSession.sharedInstance().setCategory(.playback, mode: .moviePlayback)
      try AVAudioSession.sharedInstance().setActive(true)

    } catch(let error) {
      print(error.localizedDescription)
    }
  }

  fileprivate func setUpPlayerContainer() {
    playerContainerView = UIView()
    playerContainerView.backgroundColor = .black
    addSubview(playerContainerView)
    playerContainerView.translatesAutoresizingMaskIntoConstraints = false
    NSLayoutConstraint.activate([
      playerContainerView.leadingAnchor.constraint(equalTo: leadingAnchor),
      playerContainerView.trailingAnchor.constraint(equalTo: trailingAnchor),
      playerContainerView.heightAnchor.constraint(equalTo: heightAnchor, multiplier: 1),
      playerContainerView.topAnchor.constraint(equalTo: topAnchor)
    ])
    addPlayerToView(playerContainerView)
  }

  fileprivate func commoninit() {
    setUpAudioSession()
    setUpPlayerContainer()
  }

  fileprivate func addPlayerToView( _ view: UIView){
    player = AVPlayer()
    playerLayer = AVPlayerLayer(player: player)
    playerLayer.videoGravity = .resizeAspectFill
    view.layer.addSublayer(playerLayer)
    NotificationCenter.default.addObserver(self, selector: #selector(playerEndPlay), name: .AVPlayerItemDidPlayToEndTime, object: nil)
    setupRemoteTransportControls()
    setUpObservers()

  }

  override func layoutSubviews() {
    super.layoutSubviews()

    playerLayer.frame = playerContainerView.bounds

  }

  @objc func play(){
    isVideoPlaying = 1
    if hasEnded{
      player?.seek(to: CMTime(seconds: 0, preferredTimescale: 1000))
      player?.play()
    }
    player?.play()
  }

  @objc func pause() {
    isVideoPlaying = 0
    player?.pause()
  }

  @objc func goForwardFive() {
    guard let duration = player?.currentItem?.duration, let currentTime = player?.currentTime() else {return }
    let newTime  = CMTimeGetSeconds(currentTime) + 5.0
    if newTime < (CMTimeGetSeconds(duration) - 5.0) {
      let time = CMTime(value: CMTimeValue(newTime*1000), timescale: 1000)
      player?.seek(to: time)
    }
  }

  @objc func seekTo(_ seconds: NSNumber){
    let value = CMTime(value: CMTimeValue(truncating: NSNumber(value: seconds.intValue * 1000)), timescale: 1000)
    player?.seek(to: value)
  }

  @objc func goBackFive() {
    guard let currentTime = player?.currentTime() else {return }
    var newTime  = CMTimeGetSeconds(currentTime) - 5.0
    if newTime < 0 {
      newTime = 0
    }
    let time = CMTime(value: CMTimeValue(newTime*1000), timescale: 1000)
    player?.seek(to: time)
  }

  @objc func playerEndPlay() {
    print("Player has ended")
    hasEnded = true
    isVideoPlaying = 0
    sendOnPlayerUpdate()
  }

  @objc func playVideo( _ url: NSString){
    guard let itemUrl = URL(string: url  as String) else {return}
    let playerItem = AVPlayerItem(url: itemUrl)
    player?.replaceCurrentItem(with: playerItem)
    player?.currentItem?.addObserver(self, forKeyPath: "duration", options: [.new, .initial], context: nil)
    addTimeObseerver()
    play()
  }


  override func observeValue(forKeyPath keyPath: String?, of object: Any?, change: [NSKeyValueChangeKey : Any]?, context: UnsafeMutableRawPointer?) {
    if keyPath == "duration", let playerDuration = player?.currentItem?.duration.seconds, playerDuration > 0.0 {
      duration = getTimeString(from: player?.currentItem?.duration) as NSString
      currentPlayerTime = getTimeString(from: player?.currentTime()) as NSString
      setupNowPlaying()
      sendOnPlayerUpdate()
    }
  }


  func addTimeObseerver() {
    let interval = CMTime(seconds: 0.5, preferredTimescale: CMTimeScale(NSEC_PER_SEC))
    let mainQueue = DispatchQueue.main
    _ = player?.addPeriodicTimeObserver(forInterval: interval, queue: mainQueue, using: { [weak self] (time) in
      guard let currentItem = self?.player?.currentItem else {return}
      self?.maximumSliderValue = NSNumber(value: currentItem.duration.seconds)
      self?.minimumValue = 0
      //For some reason on my actual device running iOS14  !currentItem.currentTime().seconds.isNaN was NaN
      self?.sliderValue = !currentItem.currentTime().seconds.isNaN ? NSNumber(value: currentItem.currentTime().seconds) :  NSNumber(value:currentItem.asset.duration.seconds)
      self?.currentPlayerTime = (self?.getTimeString(from: currentItem.currentTime()) ?? "00:00") as NSString
      self?.sendOnPlayerUpdate()
    })
  }

  func getTimeString(from time: CMTime?) -> String {
    guard let time = time else {return "00:00"}
    let totalSeconds = CMTimeGetSeconds(time)
    let hours = Int(totalSeconds/3600)
    let minutes = Int(totalSeconds/60) % 60
    let seconds = Int(totalSeconds.truncatingRemainder(dividingBy: 60))
    if hours > 0 {
      return String(format: "%i:%02i:%02i", arguments: [hours,minutes,seconds])
    }else {
      return String(format: "%02i:%02i", arguments: [minutes,seconds])

    }
  }

  func setUpObservers() {
    NotificationCenter.default.addObserver(forName: UIApplication.didEnterBackgroundNotification, object: nil, queue: nil) {[weak self](_) in
      self?.playerLayer.player = nil
    }
    NotificationCenter.default.addObserver(forName: UIApplication.willEnterForegroundNotification, object: nil, queue: nil) { [weak self](_) in
      self?.playerLayer.player = self?.player
    }
  }

  func setupRemoteTransportControls() {
    // Get the shared MPRemoteCommandCenter
    let commandCenter = MPRemoteCommandCenter.shared()
    commandCenter.skipBackwardCommand.isEnabled = true
    commandCenter.skipForwardCommand.isEnabled = true
    commandCenter.changePlaybackPositionCommand.isEnabled = true

    // Add handler for Play Command
    commandCenter.playCommand.addTarget { [weak self] event in
      guard let player = self?.player else {return .commandFailed}
      if player.rate == 0.0 {
        self?.play()
        self?.sendOnPlayerUpdate()
        return .success
      }
      return .commandFailed
    }
    // Add Handler to seek forward 5
    commandCenter.skipForwardCommand.addTarget { [weak self](event) in
      if let _ = self?.player{
        self?.goForwardFive()
        self?.sendOnPlayerUpdate()
        return .success
      }
      return .commandFailed
    }

    commandCenter.changePlaybackPositionCommand.addTarget {[weak self] (event) in
      if let player = self?.player {
        let playerRate = player.rate
        if let event = event as? MPChangePlaybackPositionCommandEvent {
          player.seek(to: CMTime(seconds: event.positionTime, preferredTimescale: CMTimeScale(1000)), completionHandler: { (success) in

            if success {
              self?.player?.rate = playerRate
              self?.setupNowPlaying()
              self?.sendOnPlayerUpdate()
            }
          })
          return .success
        }
      }
      return .commandFailed
    }

    //Add Handler to seek backward 5
    commandCenter.skipBackwardCommand.addTarget { [weak self] event in
      if let _ = self?.player{
        self?.goBackFive()
        self?.sendOnPlayerUpdate()
        return .success
      }
      return .commandFailed
    }

    // Add handler for Pause Command
    commandCenter.pauseCommand.addTarget { [weak self] event in
      guard let player = self?.player else {return .commandFailed}
      if player.rate == 1.0 {
        self?.pause()
        self?.sendOnPlayerUpdate()
        return .success
      }
      return .commandFailed
    }
  }

  func setupNowPlaying() {
    nowPlayingInfo[MPMediaItemPropertyTitle] = name
    nowPlayingInfo[MPNowPlayingInfoPropertyElapsedPlaybackTime] = player?.currentTime().seconds
    nowPlayingInfo[MPMediaItemPropertyPlaybackDuration] = player?.currentItem?.duration.seconds
    nowPlayingInfo[MPNowPlayingInfoPropertyPlaybackRate] = player?.rate
    // Set the metadata
    MPNowPlayingInfoCenter.default().nowPlayingInfo = nowPlayingInfo
  }

  fileprivate func setUpNowPlayingWithThumbnail() {
    if let urlString = thumbnailUrl as String? ,let url = URL(string: urlString)  {
      downloadImage(url: url) {[weak self] (image) in
        if let image = image{
          self?.nowPlayingInfo[MPMediaItemPropertyArtwork] =
            MPMediaItemArtwork(boundsSize: image.size) { size in
              return image
            }
          MPNowPlayingInfoCenter.default().nowPlayingInfo = self?.nowPlayingInfo
        }
      }
    }
  }

  func sendOnPlayerUpdate(){
    if let onPlayerUpdate = onPlayerUpdate {
      maximumSliderValue = maximumSliderValue.doubleValue.isNaN ? 0 as NSNumber : maximumSliderValue
      onPlayerUpdate(["duration": duration, "currentTime": currentPlayerTime, "sliderValue": sliderValue, "sliderMinValue": minimumValue, "sliderMaxValue":maximumSliderValue, "isPlaying": isVideoPlaying])
    }
  }

  func sendSliderValueUpdate(){
    if let onPlayerUpdate = onPlayerUpdate {
      onPlayerUpdate(["duration": duration])
    }
  }

  deinit {
    print("Remov Observers")
    player?.currentItem?.removeObserver(self, forKeyPath: "duration")
    NotificationCenter.default.removeObserver(self)
  }

  func downloadImage(url:URL, completion: @escaping((_ image: UIImage?) -> ())){
    print("Started downloading \"\(url.deletingPathExtension().lastPathComponent)\".")
    getDataFromUrl(url: url) { (data) in
      DispatchQueue.main.async {
        print("Finished downloading \"\(url.deletingPathExtension().lastPathComponent)\".")
        completion(UIImage(data: data!))
      }
    }

  }

  func getDataFromUrl(url:URL, completion: @escaping((_ data: Data?) -> ())) {
    URLSession.shared.dataTask(with: url) { (data, response, error) in
      completion(data)
    }.resume()
  }
  
}
