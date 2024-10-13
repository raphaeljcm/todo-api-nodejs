export const buildRoutePath = (path) => {
  // this will get any :routeParam
  const routeParamRegex = /:([a-zA-Z]+)/g 

  // this will transform to this: /users/([a-z0-9\-_]+) so basically will find a /users/:anything a-z0-9 as valid
  // the ?<$1> is to set all the route params in the groups regex with names
  const pathWithParams = path.replaceAll(routeParamRegex, '(?<$1>[a-z0-9\-_]+)')

  // ^ tell RegExp that the Regex starts after the ^. This will be the route params part
  // after that, will be the query params part
  const pathRegex = new RegExp(`^${pathWithParams}(?<query>\\?(.*))?$`)
  return pathRegex
}