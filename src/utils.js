// Utility functions for the app
export function createPageUrl(pageName) {
  const routes = {
    Home: '/',
    Stories: '/stories',
    Destinations: '/destinations',
    About: '/about',
  };
  return routes[pageName] || '/';
}
