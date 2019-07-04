import {
  DOMAlign,
} from '../../rocket/rocket';

const tooltip = document.querySelector('.tooltip') as HTMLElement;
const tooltipInner = document.querySelector('.tooltip-inner') as HTMLElement;
const tooltipDoc = document.querySelector('.tooltip-document') as HTMLElement;
const box = document.querySelector('.box') as HTMLElement;

const alignment = DOMAlign.getTargetAlignmentPosition(tooltip, 'bottom-left', box, 'top-right', 'viewport', 20);
const alignment2 = DOMAlign.getTargetAlignmentPosition(tooltipInner, 'bottom-right', box, 'top-left', box, 20);
const alignment3 = DOMAlign.getTargetAlignmentPosition(tooltipDoc, 'top-right', box, 'bottom-left', 'document', 20);

tooltip.style.left = `${alignment.left}px`;
tooltip.style.top  = `${alignment.top}px`;

tooltipInner.style.left = `${alignment2.left}px`;
tooltipInner.style.top  = `${alignment2.top}px`;

tooltipDoc.style.left = `${alignment3.left}px`;
tooltipDoc.style.top  = `${alignment3.top}px`;