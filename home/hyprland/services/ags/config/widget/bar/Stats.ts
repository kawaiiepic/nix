const battery = await Service.import('battery')

const cpu = Variable(0, {
  poll: [3000, 'pinfo cpu'],
})
const memory_usage = Variable("", {
  poll: [3000, 'pinfo memory']
})
const memory_free = Variable(0.0, {
  poll: [3000, 'pinfo freememory']
})
const gpu_usage = Variable(0, {
  poll: [3000, 'pinfo gpu']
})
const gpu_memory = Variable(0, {
  poll: [3000, 'pinfo gpumemory']
})

export default () => Widget.Box({
  spacing: 7,
  css: 'background-color: #313244;'
    + 'border-radius: 20pt;'
    + 'padding: 0 5pt 0 5pt;'
    + 'border: solid #1e1e2e 5px;',
  children: [
    Widget.CircularProgress({
      css: 'min-width: 14px;'  // its size is min(min-height, min-width)
        + 'min-height: 14px;'
        + 'font-size: 3pt;' // to set its thickness set font-size on it
        + 'background-color: #45475a;' // set its bg color
        + 'color: #f38ba8;', // set its fg color
      startAt: 0.75,
      tooltip_text: cpu.bind().as(value => 'CPU Usage: ' + value + '%'),
      value: cpu.bind().as(n => n / 100),
    }),

    Widget.CircularProgress({
      css: 'min-width: 14px;'  // its size is min(min-height, min-width)
        + 'min-height: 14px;'
        + 'font-size: 3pt;' // to set its thickness set font-size on it
        + 'background-color: #45475a;' // set its bg color
        + 'color: #eba0ac;', // set its fg color
      startAt: 0.75,
      setup: (self) => {
        setInterval(() => { self.tooltip_text = "Memory Usage: " + memory_free.getValue() + "GBs" + "\nMemory Percentage: " + parseFloat(memory_usage.getValue()) + "%" }, 3000)
      },
      value: memory_usage.bind().as(n => parseFloat(n)),
    }),
  ],

  setup(self) {
    if (Utils.exec('hostname') == "dreamhouse") {
      self.children = [...self.children, Widget.CircularProgress({
        css: 'min-width: 14px;'  // its size is min(min-height, min-width)
          + 'min-height: 14px;'
          + 'font-size: 3pt;' // to set its thickness set font-size on it
          + 'background-color: #45475a;' // set its bg color
          + 'color: #89b4fa;', // set its fg color
        startAt: 0.75,
        tooltip_text: gpu_usage.bind().as(value => 'GPU Usage: ' + value.toString() + '%'),
        value: gpu_usage.bind().as(n => n / 100),
      }),

      Widget.CircularProgress({
        css: 'min-width: 14px;'  // its size is min(min-height, min-width)
          + 'min-height: 14px;'
          + 'font-size: 3pt;' // to set its thickness set font-size on it
          + 'background-color: #45475a;' // set its bg color
          + 'color: #74c7ec;', // set its fg color
        startAt: 0.75,
        tooltip_text: gpu_memory.bind().as(value => 'GPU Memory: ' + value.toString() + '%'),
        value: gpu_memory.bind().as(n => n / 100),
      })]
    }

    if (battery.available) {
      self.children = [...self.children, Widget.CircularProgress({
        visible: battery.bind('available'),
        value: battery.bind('percent').as(p => p > 0 ? p / 100 : 0),
        class_name: battery.bind('charging').as(ch => ch ? 'charging' : ''),
        css: 'min-width: 14px;'  // its size is min(min-height, min-width)
          + 'min-height: 14px;'
          + 'font-size: 3pt;' // to set its thickness set font-size on it
          + 'background-color: #45475a;' // set its bg color
          + 'color: green;', // set its fg color
        startAt: 0.75,
        setup: (self) => {
          setInterval(() => { self.tooltip_text = "Available: " + battery.available + "\nPercent: " + battery.percent + "\nCharging: " + battery.charging + "\nCharged: " + battery.charged + "\nTime Remaining: " + (battery.time_remaining / 60) + " mins" + "\nEnergy: " + battery.energy + "\nCapacity: " + battery.energy_full + "\nDrain Rate: " + battery.energy_rate; }, 1000)
        },

      })]
    }
  },
})