export default (types, request, success, failure) => (...payload) => ({ types, request, success, failure, payload });
