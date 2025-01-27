export default function base_url() {
    // setup base url
    // for consuming the third party api
    if (process.env.NODE_ENV === 'development') return "http://localhost:3000";
    else return "https://api-barbarpotato.vercel.app";
}