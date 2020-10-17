//
//  VideoPlayerView.swift
//  HudleVideoPlayer
//
//  Created by Tanaka Mazivanhanga on 10/16/20.
//

import UIKit
import AVFoundation

class VideoPlayerView: UIView {
    var player: AVPlayer?
    var playerLayer:  AVPlayerLayer!
  var playerContainerView: UIView!
  var isVideoPlaying: Bool = false

//  @IBOutlet weak var customPlayerView: UIView!
  @objc var url: NSString = "" {
    didSet {
        print(url)
      playVideo(url)
    }
  }
  @objc var onDurationUpdate: RCTDirectEventBlock?
  @objc var maximumSliderValue: NSNumber = 0
  @objc var sliderValue: NSNumber = 0
  @objc var minimumValue:NSNumber = 0

  @objc var duration: NSString = ""
  @objc var currentPlayerTime: NSString = ""

  override init(frame: CGRect) {
    super.init(frame: frame)
    commoninit()
  }

  lazy var label: UILabel = {
    let label = UILabel()
    label.autoresizingMask = [.flexibleWidth, .flexibleHeight]
    return label
  }()

  required init?(coder aDecoder: NSCoder) {
//    super.init(coder: aDecoder)
//    commoninit()
    fatalError("init(coder:) has not been implemented")
  }

  fileprivate func commoninit() {
    do {
        try AVAudioSession.sharedInstance().setCategory(.playback, mode: .moviePlayback)
        try AVAudioSession.sharedInstance().setActive(true)

    } catch(let error) {
        print(error.localizedDescription)
    }
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
//    let name = String(describing: type(of: self))
////    let nib = UINib(nibName: name, bundle: .main)
////    nib.instantiate(withOwner: self, options: nil)
//    guard let xibView = Bundle.main.loadNibNamed(name, owner: self, options: nil)?.first as? UIView else {return}
//    xibView.frame = self.bounds
//    addSubview(xibView)
//    addPlayerToView(self.customPlayerView)
  }

  fileprivate func addPlayerToView( _ view: UIView){
    player = AVPlayer()
    playerLayer = AVPlayerLayer(player: player)
    playerLayer.videoGravity = .resizeAspectFill
    playerLayer.backgroundColor = UIColor.blue.cgColor
    view.layer.addSublayer(playerLayer)
    NotificationCenter.default.addObserver(self, selector: #selector(playerEndPlay), name: .AVPlayerItemDidPlayToEndTime, object: nil)

  }

  override func layoutSubviews() {
    super.layoutSubviews()

    playerLayer.frame = playerContainerView.bounds

  }

  @objc func play(){
    isVideoPlaying = true
    player?.play()
  }

  @objc func pause() {
    isVideoPlaying = false
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
  }

  @objc func playVideo( _ url: NSString){
    guard let itemUrl = URL(string: url  as String) else {return}
    let playerItem = AVPlayerItem(url: itemUrl)
    player?.replaceCurrentItem(with: playerItem)
    player?.currentItem?.addObserver(self, forKeyPath: "duration", options: [.new, .initial], context: nil)
    addTimeObseerver()
    player?.play()
  }


  override func observeValue(forKeyPath keyPath: String?, of object: Any?, change: [NSKeyValueChangeKey : Any]?, context: UnsafeMutableRawPointer?) {
    if keyPath == "duration", let duration = player?.currentItem?.duration.seconds, duration > 0.0 {
      self.duration = getTimeString(from: player?.currentItem?.duration) as NSString
      self.currentPlayerTime = getTimeString(from: player?.currentTime()) as NSString
sendDurationUpdate()
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
      self?.sendDurationUpdate()
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

  func sendDurationUpdate(){
    if let onDurationUpdate = onDurationUpdate {
      maximumSliderValue = maximumSliderValue.doubleValue.isNaN ? 0 as NSNumber : maximumSliderValue
      onDurationUpdate(["duration": duration, "currentTime": currentPlayerTime, "sliderValue": sliderValue, "sliderMinValue": minimumValue, "sliderMaxValue":maximumSliderValue])
    }
  }

  func sendSliderValueUpdate(){
    if let onDurationUpdate = onDurationUpdate {
      onDurationUpdate(["duration": duration])
    }
  }

  deinit {
    print("Remov Observers")
    player?.currentItem?.removeObserver(self, forKeyPath: "duration")
  }
  
}
