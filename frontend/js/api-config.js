const metaApiBase=document.querySelector('meta[name="gmarg-api-base"]');
const configuredApiBase=metaApiBase&&metaApiBase.content?metaApiBase.content.trim():null;
const localFrontend=window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1";
const differentLocalPort=localFrontend&&window.location.port&&window.location.port!=="3000";
window.GMARG_API_BASE=configuredApiBase||"/api";
if(!configuredApiBase&&differentLocalPort){
  window.GMARG_API_BASE=`http://${window.location.hostname}:3000/api`;
}
