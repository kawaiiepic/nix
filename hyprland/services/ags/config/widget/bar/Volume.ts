const audio = await Service.import('audio')

export default () => {
  const icons = {
    101: 'overamplified',
    67: 'high',
    34: 'medium',
    1: 'low',
    0: 'muted',
  }

  function getIcon() {
    const icon: any = audio.speaker.is_muted ? 0 : [101, 67, 34, 1, 0].find(
      threshold => threshold <= audio.speaker.volume * 100)

    return `audio-volume-${icons[icon]}-symbolic`
  }

  const icon = Widget.Icon({
    class_name: "icons",
    icon: Utils.watch(getIcon(), audio.speaker, getIcon),
    setup: self => self.hook(audio.speaker, () => {
      self.tooltip_text = Math.floor(audio.speaker.volume * 100) + "%"
    }),
  })

  const slider = Widget.Slider({
    hexpand: true,
    draw_value: false,
    on_change: ({ value }) => audio.speaker.volume = value,
    setup: self => self.hook(audio.speaker, () => {
      self.value = audio.speaker.volume || 0
      self.tooltip_text = Math.floor(audio.speaker.volume * 100) + "%"
    }),
  })

  return Widget.EventBox({
    "on-primary-click": () => {
      const audios = ["alsa_output.usb-SteelSeries_SteelSeries_Arctis_Nova_5X-00.pro-output-0", "alsa_output.pci-0000_03_00.1.hdmi-stereo"];

      if (audio.speaker.name == audios[0]) {
        for (var speaker of audio.speakers) {
          if (speaker.name == audios[1] && speaker.stream != null) {
            audio.control.set_default_sink(speaker.stream);
          }
        }
      }
    },

    "on-secondary-click": () => {
      Utils.execAsync('pavucontrol')
    },
    child: Widget.Box({
      class_name: 'volume',
      css: 'min-width: 130px',
      children: [icon, slider],
    })
  })
}