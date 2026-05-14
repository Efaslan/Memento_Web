export const getBrowserDeviceInfo = () => {
  const ua = navigator.userAgent;
  let deviceModel = "Web Browser";
  let osVersion = "Unknown OS";

  if (ua.includes("Chrome")) deviceModel = "Chrome";
  else if (ua.includes("Firefox")) deviceModel = "Firefox";
  else if (ua.includes("Safari")) deviceModel = "Safari";
  else if (ua.includes("Edge")) deviceModel = "Edge";

  if (ua.includes("Windows")) osVersion = "Windows";
  else if (ua.includes("Mac")) osVersion = "MacOS";
  else if (ua.includes("Linux")) osVersion = "Linux";

  return { deviceModel, osVersion };
};