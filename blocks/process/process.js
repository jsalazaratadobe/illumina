export default function decorate(block) {
  const steps = [...block.children];
  steps.forEach((step) => {
    step.classList.add('process-step');
    const children = [...step.children];
    if (children.length >= 2) {
      children[0].classList.add('process-step-icon');
      children[1].classList.add('process-step-content');
    }
  });
}
