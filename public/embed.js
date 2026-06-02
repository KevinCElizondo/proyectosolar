(function() {
  // Try to find the script tag to get attributes
  const currentScript = document.currentScript || (function() {
      const scripts = document.getElementsByTagName('script');
      for (let i = 0; i < scripts.length; i++) {
          if (scripts[i].src.includes('embed.js')) return scripts[i];
      }
      return null;
  })();

  if (!currentScript) {
      console.error('SolarFluidity 3D: No se pudo localizar el script de incrustación.');
      return;
  }

  const storeId = currentScript.getAttribute('data-store');
  if (!storeId) {
      console.error('SolarFluidity 3D: Falta el atributo data-store en el script.');
      return;
  }

  // Find the container where the 3D configurator will be injected
  const container = document.querySelector('.solar-fluidity-configurator');
  if (!container) {
      console.error('SolarFluidity 3D: Falta el contenedor <div class="solar-fluidity-configurator"></div>.');
      return;
  }

  // Determine the base URL from where the script was loaded, fallback to default app domain
  let baseUrl = 'https://app.solarfluidity.com';
  try {
      if (currentScript.src) {
          const url = new URL(currentScript.src);
          // If loaded locally or another domain, use its origin
          baseUrl = url.origin;
      }
  } catch (e) {
      // Ignored
  }

  // Determine the product ID if specified in the container
  const productId = container.getAttribute('data-product');
  let iframeUrl = `${baseUrl}/embed/${storeId}`;
  if (productId) {
      iframeUrl += `?product=${productId}`;
  }

  // Create and inject the iframe
  const iframe = document.createElement('iframe');
  iframe.src = iframeUrl;
  iframe.style.width = '100%';
  iframe.style.height = container.getAttribute('data-height') || '600px';
  iframe.style.border = 'none';
  iframe.style.borderRadius = '8px'; // Add some subtle styling
  iframe.style.overflow = 'hidden';
  iframe.allow = 'xr-spatial-tracking; fullscreen'; // Allow AR/VR and fullscreen if needed later

  // Clear any placeholder content and append iframe
  container.innerHTML = '';
  container.appendChild(iframe);
})();
