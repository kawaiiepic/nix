import { format } from "date-fns";

var visible = false;

const time = Variable("", {
  poll: [
    1000,
    function () {
      return format(new Date(), "HH:mm — EEEE"); // MMM do
    },
  ],
});

const date = Variable("", {
  poll: [
    1000,
    function () {
      return format(new Date(), "(MM/dd/yyyy)");
    },
  ],
});

const tooltip = Variable("", {
  poll: [
    1000,
    function () {
      return format(new Date(), "MMMM 'the' do");
    },
  ],
});

const revealer = Widget.Revealer({
   transitionDuration: 1000,
   transition: "slide_right",
   child: Widget.Label({
     class_name: "date",
     label: date.bind(),
   }),
 });

export default () =>
  Widget.EventBox({
    class_name: "date",
    on_primary_click: () => {
      if (visible) {
        visible = false;
        App.closeWindow("clockbar");
      } else {
        visible = true;
        App.openWindow("clockbar");
      }
    },

    on_hover: () => {
      revealer.reveal_child = true;
      Utils.timeout(3000, () => {
        revealer.reveal_child = false;
      });
    },
    child: Widget.Box({
      spacing: 2,
      children: [
        Widget.Label({
          label: time.bind(),
          tooltip_text: tooltip.bind(),
        }),
        revealer
      ],
    }),
  });
