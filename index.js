import { Kefir as K } from "kefir";
import MoveTo from "moveto";

const REASONABLE_MODIFIER = K.constant(d => d / 4);
const NO_OFFSET = K.constant(0);

function offsetTop(element) {
  if (!element.getClientRects().length) {
    return 0;
  }

  const rect = element.getBoundingClientRect();
  const win = element.ownerDocument.defaultView;

  return rect.top + win.pageYOffset;
}

function flâneur(
  { modifier = REASONABLE_MODIFIER, offset = NO_OFFSET },
  scrollY
) {
  const manager = new MoveTo();

  const destinationStream = K.pool();
  const requestedPath = K.combine([scrollY, destinationStream]).sampledBy(
    destinationStream
  );

  const requestPlan = K.combine(
    [modifier, offset.sampledBy(requestedPath), requestedPath],
    (m, o, [from, to]) => {
      if (typeof from !== "number") {
        throw `The scrollY property is not a number: ${from}`;
      }

      const destination = typeof to === "number" ? to : offsetTop(to);
      const delta = destination - from + o;
      const duration = m(Math.abs(delta));

      return {
        duration: duration,
        delta: delta
      };
    }
  );

  requestPlan.observe(plan => {
    manager.move(plan.delta, {
      duration: plan.duration
    });
  });

  const regard = s => destinationStream.plug(s);

  return { regard };
}

export default flâneur;
