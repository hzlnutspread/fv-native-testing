/** @type {import('next').NextConfig} */
module.exports = {
    reactStrictMode: true,
    env: {
        CALLER_PRIVATE_KEY: process.env.CALLER_PRIVATE_KEY,
    },
}
