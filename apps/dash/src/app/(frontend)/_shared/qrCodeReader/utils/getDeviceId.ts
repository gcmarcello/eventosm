function defaultDeviceIdChooser(
  filteredDevices: MediaDeviceInfo[],
  videoDevices: MediaDeviceInfo[],
  facingMode: string
) {
  if (filteredDevices.length > 0) return filteredDevices[0].deviceId;
  if (videoDevices.length === 1 || facingMode === 'user') return videoDevices[0].deviceId;
  return videoDevices[1].deviceId;
}

const getDeviceId = (
  facingMode: string,
  chooseDeviceId: (
    filteredDevices: MediaDeviceInfo[],
    videoDevices: MediaDeviceInfo[],
    facingMode: string
  ) => string = defaultDeviceIdChooser
) => new Promise<string>((resolve, reject) => {
  try {
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      const videoDevices = devices.filter((device) => device.kind === 'videoinput');
      if (videoDevices.length < 1) {
        reject(new Error('No video input devices found'));
        return;
      }
      const pattern = facingMode === 'environment' ? /rear|back|environment/gi : /front|user|face/gi
      const filteredDevices = videoDevices.filter(({ label }) => pattern.test(label));
      resolve(chooseDeviceId(filteredDevices, videoDevices, facingMode));
    });
  } catch (err) {
    reject(new Error('No video input devices found'));
  }
})

export default getDeviceId;