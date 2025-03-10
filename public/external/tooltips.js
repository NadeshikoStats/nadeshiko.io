// tooltip positioning handler.
document.addEventListener('DOMContentLoaded', () => {
  setupTooltips();

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === 1) { // Element node
          const tooltips = node.getElementsByClassName('tooltip');
          if (tooltips.length > 0) {
            Array.from(tooltips).forEach(setupTooltip);
          }
        }
      });
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
});

function setupTooltips() {
  const tooltips = document.getElementsByClassName('tooltip');
  Array.from(tooltips).forEach(setupTooltip);
}

function setupTooltip(tooltip) {
  const tooltipText = tooltip.querySelector('.tooltiptext');
  if (!tooltipText) return;

  tooltip.addEventListener('mouseenter', () => {
    positionTooltip(tooltip, tooltipText);
  });

  tooltip.addEventListener('mouseleave', () => {
    tooltipText.style.opacity = '0';
    
    setTimeout(() => {
      if (!tooltip.matches(':hover')) {
        tooltipText.style.visibility = 'hidden';
        tooltipText.style.pointerEvents = 'none';
      }
    }, 300);
  });
  
  let scrollableParents = findScrollableParents(tooltip);
  
  scrollableParents.forEach(parent => {
    parent.addEventListener('scroll', () => {
      if (tooltip.matches(':hover')) {
        positionTooltip(tooltip, tooltipText);
      }
    });
  });

  window.addEventListener('resize', () => {
    if (tooltip.matches(':hover')) {
      positionTooltip(tooltip, tooltipText);
    }
  });
}

function findScrollableParents(element) {
  let parents = [];
  let style;
  while (element && element !== document.body) {
    style = window.getComputedStyle(element);
    if (/(auto|scroll)/.test(style.overflow + style.overflowX + style.overflowY)) {
      parents.push(element);
    }
    element = element.parentElement;
  }
  return parents;
}

function getViewportRelativeRect(element) {
  const rect = element.getBoundingClientRect();
  const scrollableParents = findScrollableParents(element);
  
  if (scrollableParents.length === 0) {
    return {
      top: rect.top || 0,
      bottom: rect.bottom || 0,
      left: rect.left || 0,
      right: rect.right || 0,
      width: rect.width || 0,
      height: rect.height || 0
    };

  }

  //console.log('original rect', rect);

  let finalRect = {
    top: rect.top || 0,
    bottom: rect.bottom || 0,
    left: rect.left || 0,
    right: rect.right || 0,
    width: rect.width || 0,
    height: rect.height || 0
  };

  scrollableParents.forEach(parent => {
    const parentRect = parent.getBoundingClientRect();
    //console.log('parent rect', parentRect);
    
    finalRect = {
      top: Math.max(finalRect.top, parentRect.top || 0),
      bottom: Math.min(finalRect.bottom, parentRect.bottom || 0),
      left: Math.max(finalRect.left, parentRect.left || 0),
      right: Math.min(finalRect.right, parentRect.right || 0),
      width: finalRect.width,
      height: finalRect.height
    };
  });

  //console.log('final rect ', finalRect);
  return finalRect;
}

function positionTooltip(tooltip, tooltipText) {
  
  tooltipText.style.top = '';
  tooltipText.style.bottom = '';
  tooltipText.style.left = '';
  tooltipText.style.right = '';
  tooltipText.style.transform = '';
  tooltipText.classList.remove('tooltip-above', 'tooltip-below');

  tooltipText.style.visibility = 'visible';
  tooltipText.style.opacity = '0';
  tooltipText.style.pointerEvents = 'none';

  tooltipText.style.display = 'block';
  void tooltipText.offsetHeight;

  const tooltipRect = tooltip.getBoundingClientRect();
  const tooltipTextRect = tooltipText.getBoundingClientRect();
  
  const spaceAbove = tooltipRect.top;
  const spaceBelow = window.innerHeight - tooltipRect.bottom;
  
  const tooltipTextHeight = tooltipTextRect.height || 0;
  const tooltipTextWidth = tooltipTextRect.width || 0;

  const verticalPadding = 10;

  let verticalPosition;
  if (spaceAbove > tooltipTextHeight + verticalPadding || spaceAbove > spaceBelow) {
    verticalPosition = tooltipRect.top - tooltipTextHeight - verticalPadding;
    tooltipText.classList.add('tooltip-above');
  } else {
    verticalPosition = tooltipRect.bottom + verticalPadding;
    tooltipText.classList.add('tooltip-below');
  }

  const tooltipCenter = tooltipRect.left + (tooltipRect.width / 2);
  const idealLeft = tooltipCenter - (tooltipTextWidth / 2);
  
  let horizontalPosition;
  const horizontalMargin = 10;

  // does it overflow
  if (idealLeft < horizontalMargin) {
    horizontalPosition = horizontalMargin;
  } else if (idealLeft + tooltipTextWidth > window.innerWidth - horizontalMargin) {
    horizontalPosition = window.innerWidth - tooltipTextWidth - horizontalMargin;
  } else {
    horizontalPosition = idealLeft;
  }

  const isInQuestList = tooltip.closest('.quest-list') !== null; // why does this work? uhhhhhh
  
  let positionedParent = null;
  let element = tooltip;
  
  while (element && element !== document.body) {
    const position = window.getComputedStyle(element).position;
    if ((position === 'fixed' || position === 'absolute' || element.classList.contains('quest-list')) && !element.classList.contains('flex-container')) {
      positionedParent = element;
      break;
    }
    element = element.parentElement;
  }

  if (positionedParent) {
    const parentRect = positionedParent.getBoundingClientRect();
    
    if (isInQuestList) {
      horizontalPosition = horizontalPosition - parentRect.left;
      verticalPosition = verticalPosition - parentRect.top;
    } else {
      horizontalPosition = Math.max(horizontalMargin, Math.min(
        horizontalPosition - parentRect.left,
        parentRect.width - tooltipTextWidth - horizontalMargin
      ));
      verticalPosition = Math.max(verticalPadding, Math.min(
        verticalPosition - parentRect.top,
        parentRect.height - tooltipTextHeight - verticalPadding
      ));
    }
  }

  tooltipText.style.top = `${verticalPosition}px`;
  tooltipText.style.left = `${horizontalPosition}px`;
  
  tooltipText.style.pointerEvents = 'auto';
  tooltipText.style.opacity = '1';
  
//   console.log('final ', {
//     top: tooltipText.style.top,
//     left: tooltipText.style.left,
//     transform: tooltipText.style.transform
//   });
} 