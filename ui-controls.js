window.addEventListener('DOMContentLoaded', () => {
    const brushSelect = document.querySelector('#brushSelect');
    const strokeContainer = document.querySelector('#stroke-container');
    const sidesContainer = document.querySelector('#sides-container');
    const intervalContainer = document.querySelector('#interval-container');
    const opacityContainer = document.querySelector('#opacity-container');
    const styleContainer = document.querySelector('#style-container'); // New container for the style dropdown
  
    function updateControls() {
      const brushType = brushSelect.value;
  
      if (brushType === '1') {
        // Brush 1: Show sides, interval, opacity, style, hide stroke
        sidesContainer.style.display = 'flex';
        intervalContainer.style.display = 'flex';
        opacityContainer.style.display = 'flex';
        styleContainer.style.display = 'flex';
        strokeContainer.style.display = 'none';
      } else if (brushType === '2') {
        // Brush 2: Show stroke, hide others
        sidesContainer.style.display = 'none';
        intervalContainer.style.display = 'none';
        opacityContainer.style.display = 'none';
        styleContainer.style.display = 'none';
        strokeContainer.style.display = 'flex';
      }
    }
  
    // Trigger when the brush type is changed
    brushSelect.addEventListener('change', updateControls);
  
    // Call the function once to set the correct state on page load
    updateControls();
});
