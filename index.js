import { Kefir as K } from "kefir";
import MoveTo from "moveto";

const REASONABLE_MODIFIER = K.constant(d => d / 4);

function offsetTop(element) {
  if (!element.getClientRects().length) {
    return 0;
  }

  const rect = element.getBoundingClientRect();
  const win = element.ownerDocument.defaultView;

  return rect.top + win.pageYOffset;
}

function flâneur({ modifier = REASONABLE_MODIFIER }, scrollY) {
  const manager = new MoveTo();

  const destinationStream = K.pool();
  const requestedPath = K.combine([scrollY, destinationStream]).sampledBy(
    destinationStream
  );

  const requestPlan = K.combine([modifier, requestedPath], (m, [from, to]) => {
    const destinationOffset = typeof to === "number" ? to : offsetTop(to);
    const duration = m(Math.abs(from - destinationOffset));

    return {
      duration: duration,
      destination: to
    };
  });

  requestPlan.observe(plan => {
    manager.move(plan.destination, {
      duration: plan.duration
    });
  });

  const regard = s => destinationStream.plug(s);

  return { regard };
}

export default flâneur;
