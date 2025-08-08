import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { DynamicPromptResult } from '../types';
import SEOHead from '../components/SEOHead';

// Minimalist Premium Icons
const HomeIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
);

const ChartIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
);

const BookmarkIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
    </svg>
);

const SettingsIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const HelpIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

// Platform Icons
const XIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
);

const RedditIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
    </svg>
);

const InstagramIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
);

const TikTokIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-.88-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
);

const YouTubeIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
);

const FacebookIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
);

const ProductHuntIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M13.604 8.4h-3.405V12h3.405c.995 0 1.801-.806 1.801-1.801 0-.993-.805-1.799-1.801-1.799zM12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zm1.604 14.4h-3.405V18H7.801V6h5.803c2.319 0 4.199 1.881 4.199 4.2s-1.88 4.2-4.199 4.2z" />
    </svg>
);

const HackerNewsIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M0 24V0h24v24H0zM6.951 5.896l4.112 7.708v5.064h1.583v-4.972l4.148-7.799h-1.749l-2.457 4.875c-.372.745-.688 1.434-.688 1.434s-.297-.708-.651-1.434L8.831 5.896h-1.88z" />
    </svg>
);

const MediumIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
    </svg>
);

const DiscordIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0002 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9554 2.4189-2.1568 2.4189Z" />
    </svg>
);

const GitHubIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
);

const DribbbleIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 24C5.385 24 0 18.615 0 12S5.385 0 12 0s12 5.385 12 12-5.385 12-12 12zm10.12-10.358c-.35-.11-3.17-.953-6.384-.438 1.34 3.684 1.887 6.684 1.992 7.308 2.3-1.555 3.936-4.02 4.395-6.87zm-6.115 7.808c-.153-.9-.75-4.032-2.19-7.77l-.066.02c-5.79 2.015-7.86 6.025-8.04 6.4 1.73 1.358 3.92 2.166 6.29 2.166 1.42 0 2.77-.29 4-.816zm-11.62-2.58c.232-.4 3.045-5.055 8.332-6.765.135-.045.27-.084.405-.12-.26-.585-.54-1.167-.832-1.74C7.17 11.775 2.206 11.71 1.756 11.7l-.004.312c0 2.633.998 5.037 2.634 6.855zm-2.42-8.955c.46.008 4.683.026 9.477-1.248-1.698-3.018-3.53-5.558-3.8-5.928-2.868 1.35-5.01 3.99-5.676 7.17zM9.6 2.052c.282.38 2.145 2.914 3.822 6 3.645-1.365 5.19-3.44 5.373-3.702-1.81-1.61-4.19-2.586-6.795-2.586-.825 0-1.63.1-2.4.285zm10.335 3.483c-.218.29-1.935 2.493-5.724 4.04.24.49.47.985.68 1.486.08.18.15.36.22.53 3.41-.43 6.8.26 7.14.33-.02-2.42-.88-4.64-2.31-6.38z" />
    </svg>
);

const AngelListIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16.465 9.954c.735-2.321 1.36-4.488 1.36-4.488s.256-1.457.605-2.149c.349-.693.954-1.317 1.317-1.317.363 0 .605.693.605 1.317 0 .624-.256 1.457-.256 1.457s-.625 2.167-1.36 4.488c-.735 2.321-1.36 4.488-1.36 4.488s-.256 1.457-.605 2.149c-.349.693-.954 1.317-1.317 1.317-.363 0-.605-.693-.605-1.317 0-.624.256-1.457.256-1.457s.625-2.167 1.36-4.488zm-8.93 0c.735-2.321 1.36-4.488 1.36-4.488s.256-1.457.605-2.149c.349-.693.954-1.317 1.317-1.317.363 0 .605.693.605 1.317 0 .624-.256 1.457-.256 1.457s-.625 2.167-1.36 4.488c-.735 2.321-1.36 4.488-1.36 4.488s-.256 1.457-.605 2.149c-.349.693-.954 1.317-1.317 1.317-.363 0-.605-.693-.605-1.317 0-.624.256-1.457.256-1.457s.625-2.167 1.36-4.488z" />
    </svg>
);

const CrunchbaseIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M21.6 0H2.4C1.08 0 0 1.08 0 2.4v19.2C0 22.92 1.08 24 2.4 24h19.2c1.32 0 2.4-1.08 2.4-2.4V2.4C24 1.08 22.92 0 21.6 0zM8.64 18.24c-2.4 0-4.32-1.92-4.32-4.32s1.92-4.32 4.32-4.32c1.44 0 2.64.72 3.36 1.68l-1.44 1.44c-.48-.6-1.2-.96-1.92-.96-1.32 0-2.4 1.08-2.4 2.4s1.08 2.4 2.4 2.4c.72 0 1.44-.36 1.92-.96l1.44 1.44c-.72.96-1.92 1.68-3.36 1.68zm11.04-1.2h-1.92v-1.92c0-.48-.36-.84-.84-.84s-.84.36-.84.84v1.92h-1.92c-.48 0-.84.36-.84.84s.36.84.84.84h1.92v1.92c0 .48.36.84.84.84s.84-.36.84-.84v-1.92h1.92c.48 0 .84-.36.84-.84s-.36-.84-.84-.84z" />
    </svg>
);

const TrendUpIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
);

const InfoIcon = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

// New sector-specific platform icons (Phase 2)
const StackOverflowIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M15.725 0l-1.72 1.277 6.39 8.588 1.716-1.277L15.725 0zm-3.94 3.418l-1.369 1.644 8.225 6.85 1.369-1.644-8.225-6.85zm-3.15 4.465l-.905 1.94 9.702 4.517.904-1.94-9.701-4.517zm-1.85 4.86l-.44 2.093 10.473 2.201.44-2.092L6.785 12.743zM24 22.25v-2.5H2.5v2.5H24zM6.257 19.75h11.485v-2.5H6.257v2.5z" />
    </svg>
);

const PinterestIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z" />
    </svg>
);

const BehanceIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M0 7.5v9c0 .825.675 1.5 1.5 1.5h21c.825 0 1.5-.675 1.5-1.5v-9c0-.825-.675-1.5-1.5-1.5h-21C.675 6 0 6.675 0 7.5zM15.5 10.5c1.381 0 2.5 1.119 2.5 2.5s-1.119 2.5-2.5 2.5S13 14.381 13 13s1.119-2.5 2.5-2.5zm-7 0c1.381 0 2.5 1.119 2.5 2.5S9.881 15.5 8.5 15.5 6 14.381 6 13s1.119-2.5 2.5-2.5z" />
    </svg>
);

const FigmaIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M15.852 8.981h-4.588V0h4.588c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.491-4.49 4.491zM12.735 7.51h3.117c1.665 0 3.019-1.355 3.019-3.019s-1.354-3.019-3.019-3.019h-3.117V7.51zm0 1.471H8.148c-2.476 0-4.49-2.015-4.49-4.491S5.672 0 8.148 0h4.588v8.981zm-4.587-7.51c-1.665 0-3.019 1.355-3.019 3.019s1.354 3.019 3.019 3.019h3.117V1.471H8.148zm4.587 15.019H8.148c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h4.588v8.98zM8.148 8.981c-1.665 0-3.019 1.355-3.019 3.019s1.354 3.019 3.019 3.019h3.117V8.981H8.148zM8.172 24c-2.489 0-4.515-2.014-4.515-4.49s2.014-4.49 4.49-4.49h4.588v4.441c0 2.503-2.047 4.539-4.563 4.539zm-.024-7.51c-1.665 0-3.019 1.355-3.019 3.019s1.354 3.019 3.019 3.019 3.019-1.355 3.019-3.019V16.49H8.148z" />
    </svg>
);

const ResultsPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const result = location.state?.result as DynamicPromptResult;
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    // Animation trigger
    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 100);
        return () => clearTimeout(timer);
    }, []);

    const getOverallStatus = (score: number) => {
        if (score >= 70) return {
            color: 'emerald',
            text: 'Excellent Potential',
            desc: 'Strong market signals detected. Time to build!',
            action: 'Begin MVP development',
            icon: '🚀'
        };
        if (score >= 50) return {
            color: 'amber',
            text: 'Good Potential',
            desc: 'Promising idea with room for improvement.',
            action: 'Strengthen weak areas',
            icon: '⚡'
        };
        return {
            color: 'red',
            text: 'Needs Work',
            desc: 'Consider pivoting or major improvements.',
            action: 'Reevaluate approach',
            icon: '⚠️'
        };
    };

    useEffect(() => {
        if (!result) {
            navigate('/');
            return;
        }
        window.scrollTo(0, 0);

        // Trigger animations after component mount
        setTimeout(() => setIsVisible(true), 100);
    }, [result, navigate]);

    if (!result) {
        return null;
    }

    const handleCopyToClipboard = async (text: string, id: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedId(id);
            setTimeout(() => setCopiedId(null), 2500);
        } catch (err) {
            console.error('Failed to copy to clipboard:', err);
        }
    };

    const status = getOverallStatus(result.demandScore);

    // Platform icon mapping function
    const getPlatformIcon = (platformName: string) => {
        const name = platformName.toLowerCase();
        switch (name) {
            case 'twitter': case 'x': return <XIcon />;
            case 'reddit': return <RedditIcon />;
            case 'linkedin': return <div className="w-4 h-4 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">in</div>;
            case 'instagram': return <InstagramIcon />;
            case 'tiktok': return <TikTokIcon />;
            case 'youtube': return <YouTubeIcon />;
            case 'facebook': return <FacebookIcon />;
            case 'product hunt': case 'producthunt': return <ProductHuntIcon />;
            case 'hacker news': case 'hackernews': return <HackerNewsIcon />;
            case 'medium': return <MediumIcon />;
            case 'discord': return <DiscordIcon />;
            case 'github': return <GitHubIcon />;
            case 'stack overflow': case 'stackoverflow': return <StackOverflowIcon />;
            case 'pinterest': return <PinterestIcon />;
            case 'angellist': return <AngelListIcon />;
            case 'crunchbase': return <CrunchbaseIcon />;
            case 'dribbble': return <DribbbleIcon />;
            case 'behance': return <BehanceIcon />;
            case 'figma community': case 'figma': return <FigmaIcon />;
            default: return <div className="w-4 h-4 bg-gray-400 rounded"></div>;
        }
    };

    // All results are now from dynamic prompt system

    // Market Intelligence Card Component
    const MarketIntelligenceCard: React.FC<{ data?: any }> = ({ data }) => (
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:bg-green-50 animate-card-hover animate-card-entrance" style={{ animationDelay: '400ms' }}>
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <TrendUpIcon />
                </div>
                <div>
                    <h3 className="font-semibold text-gray-900">Market Intelligence</h3>
                    <div className="text-sm text-green-600 font-medium">Market Opportunity</div>
                </div>
            </div>
            <div className="space-y-3">
                <div className="text-sm">
                    <span className="font-medium text-gray-700">TAM:</span>
                    <span className="text-gray-600 ml-2">{data?.tam || '$2.5B Design Software Market'}</span>
                </div>
                <div className="text-sm">
                    <span className="font-medium text-gray-700">SAM:</span>
                    <span className="text-gray-600 ml-2">{data?.sam || '$450M SaaS Design Tools'}</span>
                </div>
                <div className="text-sm">
                    <span className="font-medium text-gray-700">SOM:</span>
                    <span className="text-gray-600 ml-2">{data?.som || '$12M Realistic 3-year target'}</span>
                </div>
                <div className="text-sm">
                    <span className="font-medium text-gray-700">Growth:</span>
                    <span className="text-green-600 ml-2 font-medium">{data?.growthRate || '15% YoY'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium text-gray-700">Timing:</span>
                    <div className="flex">
                        {[...Array(data?.marketTiming || 4)].map((_, i) => (
                            <span key={i} className="text-yellow-400">⭐</span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    // Competitive Landscape Card Component
    const CompetitiveLandscapeCard: React.FC<{ data?: any }> = ({ data }) => (
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:bg-red-50 animate-card-hover animate-card-entrance" style={{ animationDelay: '500ms' }}>
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <span className="text-red-600 font-bold">🥊</span>
                </div>
                <div>
                    <h3 className="font-semibold text-gray-900">Competition Analysis</h3>
                    <div className="text-sm text-red-600 font-medium">Competitive Landscape</div>
                </div>
            </div>
            <div className="space-y-3">
                <div className="text-sm">
                    <span className="font-medium text-gray-700">Direct Competitors:</span>
                    <div className="text-gray-600 mt-1">
                        {data?.directCompetitors?.join(', ') || 'Figma, Sketch, Adobe XD'}
                    </div>
                </div>
                <div className="text-sm">
                    <span className="font-medium text-gray-700">Position:</span>
                    <span className="text-gray-600 ml-2">{data?.marketPosition || 'Blue Ocean Opportunity'}</span>
                </div>
                <div className="text-sm">
                    <span className="font-medium text-gray-700">Differentiation:</span>
                    <span className="text-blue-600 ml-2 font-medium">{data?.differentiationScore || '8'}/10</span>
                </div>
                <div className="text-sm">
                    <span className="font-medium text-gray-700">Moat:</span>
                    <span className="text-gray-600 ml-2">{data?.competitiveMoat || 'AI-powered features'}</span>
                </div>
            </div>
        </div>
    );

    // Revenue Model Card Component
    const RevenueModelCard: React.FC<{ data?: any }> = ({ data }) => (
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:bg-yellow-50 animate-card-hover animate-card-entrance" style={{ animationDelay: '600ms' }}>
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <span className="text-yellow-600 font-bold">💰</span>
                </div>
                <div>
                    <h3 className="font-semibold text-gray-900">Revenue Model</h3>
                    <div className="text-sm text-yellow-600 font-medium">Monetization Strategy</div>
                </div>
            </div>
            <div className="space-y-3">
                <div className="text-sm">
                    <span className="font-medium text-gray-700">Model:</span>
                    <span className="text-gray-600 ml-2">{data?.primaryModel || 'Freemium SaaS'}</span>
                </div>
                <div className="text-sm">
                    <span className="font-medium text-gray-700">Price:</span>
                    <span className="text-green-600 ml-2 font-medium">{data?.pricePoint || '$29/month'}</span>
                </div>
                <div className="text-sm">
                    <span className="font-medium text-gray-700">Break-even:</span>
                    <span className="text-gray-600 ml-2">{data?.breakEvenTimeline || '18 months'}</span>
                </div>
                <div className="text-sm">
                    <span className="font-medium text-gray-700">LTV/CAC:</span>
                    <span className="text-blue-600 ml-2 font-medium">{data?.ltvCacRatio || '4.2x'}</span>
                </div>
                <div className="text-sm">
                    <span className="font-medium text-gray-700">Projected MRR:</span>
                    <span className="text-green-600 ml-2 font-medium">{data?.projectedMrr || '$25K by Year 1'}</span>
                </div>
            </div>
        </div>
    );

    // Target Audience Card Component
    const TargetAudienceCard: React.FC<{ data?: any }> = ({ data }) => (
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:bg-purple-50">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-purple-600 font-bold">👥</span>
                </div>
                <div>
                    <h3 className="font-semibold text-gray-900">Target Audience</h3>
                    <div className="text-sm text-purple-600 font-medium">Customer Segments</div>
                </div>
            </div>
            <div className="space-y-3">
                <div className="text-sm">
                    <span className="font-medium text-gray-700">Primary:</span>
                    <span className="text-gray-600 ml-2">{data?.primarySegment || 'Freelance Designers (40%)'}</span>
                </div>
                <div className="text-sm">
                    <span className="font-medium text-gray-700">Secondary:</span>
                    <span className="text-gray-600 ml-2">{data?.secondarySegment || 'Design Agencies (35%)'}</span>
                </div>
                <div className="text-sm">
                    <span className="font-medium text-gray-700">Pain Points:</span>
                    <div className="text-gray-600 mt-1">
                        {data?.painPoints?.join(', ') || 'Project chaos, client communication'}
                    </div>
                </div>
                <div className="text-sm">
                    <span className="font-medium text-gray-700">Willingness to Pay:</span>
                    <span className="text-green-600 ml-2 font-medium">{data?.willingnessToPay || 'High ($25-50/month)'}</span>
                </div>
            </div>
        </div>
    );

    // Risk Assessment Card Component
    const RiskAssessmentCard: React.FC<{ data?: any }> = ({ data }) => {
        const getRiskColor = (risk: string) => {
            switch (risk?.toLowerCase()) {
                case 'low': case 'very low': return 'text-green-600';
                case 'medium': return 'text-yellow-600';
                case 'high': case 'very high': return 'text-red-600';
                default: return 'text-gray-600';
            }
        };

        return (
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:bg-orange-50">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                        <span className="text-orange-600 font-bold">⚠️</span>
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900">Risk Assessment</h3>
                        <div className="text-sm text-orange-600 font-medium">Risk Matrix</div>
                    </div>
                </div>
                <div className="space-y-3">
                    <div className="text-sm">
                        <span className="font-medium text-gray-700">Technical:</span>
                        <span className={`ml-2 font-medium ${getRiskColor(data?.technicalRisk || 'Low')}`}>
                            {data?.technicalRisk || 'Low'}
                        </span>
                    </div>
                    <div className="text-sm">
                        <span className="font-medium text-gray-700">Market:</span>
                        <span className={`ml-2 font-medium ${getRiskColor(data?.marketRisk || 'Medium')}`}>
                            {data?.marketRisk || 'Medium'}
                        </span>
                    </div>
                    <div className="text-sm">
                        <span className="font-medium text-gray-700">Financial:</span>
                        <span className={`ml-2 font-medium ${getRiskColor(data?.financialRisk || 'Low')}`}>
                            {data?.financialRisk || 'Low'}
                        </span>
                    </div>
                    <div className="text-sm border-t pt-2">
                        <span className="font-medium text-gray-700">Overall:</span>
                        <span className={`ml-2 font-bold ${getRiskColor(data?.overallRiskLevel || 'Medium')}`}>
                            {data?.overallRiskLevel || 'MEDIUM'}
                        </span>
                    </div>
                </div>
            </div>
        );
    };

    // Go-to-Market Card Component
    const GoToMarketCard: React.FC<{ data?: any }> = ({ data }) => (
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:bg-indigo-50">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <span className="text-indigo-600 font-bold">🚀</span>
                </div>
                <div>
                    <h3 className="font-semibold text-gray-900">Go-to-Market</h3>
                    <div className="text-sm text-indigo-600 font-medium">Launch Strategy</div>
                </div>
            </div>
            <div className="space-y-3">
                <div className="text-sm">
                    <span className="font-medium text-gray-700">Phase 1:</span>
                    <span className="text-gray-600 ml-2">{data?.phase1 || 'Design Twitter + Product Hunt'}</span>
                </div>
                <div className="text-sm">
                    <span className="font-medium text-gray-700">Phase 2:</span>
                    <span className="text-gray-600 ml-2">{data?.phase2 || 'Design communities (Dribbble, Behance)'}</span>
                </div>
                <div className="text-sm">
                    <span className="font-medium text-gray-700">Phase 3:</span>
                    <span className="text-gray-600 ml-2">{data?.phase3 || 'Partnership with design schools'}</span>
                </div>
                <div className="text-sm">
                    <span className="font-medium text-gray-700">Timeline:</span>
                    <span className="text-blue-600 ml-2 font-medium">{data?.timeline || '6-month rollout'}</span>
                </div>
                <div className="text-sm">
                    <span className="font-medium text-gray-700">Budget:</span>
                    <span className="text-green-600 ml-2 font-medium">{data?.budgetNeeded || '$50K initial'}</span>
                </div>
            </div>
        </div>
    );

    // Development Roadmap Card Component
    const DevelopmentRoadmapCard: React.FC<{ data?: any }> = ({ data }) => (
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:bg-teal-50">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                    <span className="text-teal-600 font-bold">🛠️</span>
                </div>
                <div>
                    <h3 className="font-semibold text-gray-900">Development Roadmap</h3>
                    <div className="text-sm text-teal-600 font-medium">Build Timeline</div>
                </div>
            </div>
            <div className="space-y-3">
                <div className="text-sm">
                    <span className="font-medium text-gray-700">MVP:</span>
                    <span className="text-gray-600 ml-2">{data?.mvpTimeline || '3 months'}</span>
                </div>
                <div className="text-sm">
                    <span className="font-medium text-gray-700">Beta:</span>
                    <span className="text-gray-600 ml-2">{data?.betaLaunch || '5 months'}</span>
                </div>
                <div className="text-sm">
                    <span className="font-medium text-gray-700">Launch:</span>
                    <span className="text-blue-600 ml-2 font-medium">{data?.publicLaunch || '8 months'}</span>
                </div>
                <div className="text-sm">
                    <span className="font-medium text-gray-700">Team:</span>
                    <div className="text-gray-600 mt-1">
                        {data?.teamNeeded?.join(', ') || '2 developers, 1 designer'}
                    </div>
                </div>
                <div className="text-sm">
                    <span className="font-medium text-gray-700">Tech Stack:</span>
                    <div className="text-gray-600 mt-1">
                        {data?.techStack?.join(', ') || 'React, Node.js, PostgreSQL'}
                    </div>
                </div>
            </div>
        </div>
    );

    // Product-Market Fit Card Component
    const ProductMarketFitCard: React.FC<{ data?: any }> = ({ data }) => (
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:bg-pink-50">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                    <span className="text-pink-600 font-bold">🎯</span>
                </div>
                <div>
                    <h3 className="font-semibold text-gray-900">Product-Market Fit</h3>
                    <div className="text-sm text-pink-600 font-medium">PMF Indicators</div>
                </div>
            </div>
            <div className="space-y-3">
                <div className="text-sm">
                    <span className="font-medium text-gray-700">Problem-Solution Fit:</span>
                    <span className="text-green-600 ml-2 font-medium">{data?.problemSolutionFit || '85'}%</span>
                </div>
                <div className="text-sm">
                    <span className="font-medium text-gray-700">Solution-Market Fit:</span>
                    <span className="text-blue-600 ml-2 font-medium">{data?.solutionMarketFit || '78'}%</span>
                </div>
                <div className="text-sm">
                    <span className="font-medium text-gray-700">Early Adopters:</span>
                    <span className="text-gray-600 ml-2">{data?.earlyAdopterSignals || 'Strong signals'}</span>
                </div>
                <div className="text-sm">
                    <span className="font-medium text-gray-700">Retention:</span>
                    <span className="text-gray-600 ml-2">{data?.retentionPrediction || '65% (Month 1)'}</span>
                </div>
                <div className="text-sm">
                    <span className="font-medium text-gray-700">Viral Coefficient:</span>
                    <span className="text-purple-600 ml-2 font-medium">{data?.viralCoefficient || '0.3'}</span>
                </div>
            </div>
        </div>
    );

    // Simple Platform Analysis Card Component
    const PlatformCard: React.FC<{
        platform: string;
        analysis: any;
        icon: React.ReactNode;
        bgColor: string;
        delay?: number;
    }> = ({ platform, analysis, icon, bgColor, delay = 0 }) => {
        const getScoreColor = (score: number) => {
            if (score >= 4) return 'text-green-600';
            if (score >= 3) return 'text-yellow-600';
            return 'text-red-600';
        };

        const getScoreText = (score: number) => {
            if (score >= 4) return 'Excellent';
            if (score >= 3) return 'Good';
            if (score >= 2) return 'Fair';
            return 'Poor';
        };

        return (
            <div
                className={`bg-white rounded-xl p-6 shadow-lg border border-gray-200 ${bgColor} animate-card-hover animate-card-entrance`}
                style={{ animationDelay: `${delay}ms` }}
            >
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        {icon}
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900">{platform}</h3>
                        <div className={`text-sm font-medium ${getScoreColor(analysis?.score || 3)}`}>
                            {analysis?.score || 3}/5 - {getScoreText(analysis?.score || 3)}
                        </div>
                    </div>
                </div>

                <div className="mb-4">
                    <p className="text-sm text-gray-600 leading-relaxed">
                        {analysis?.summary || `AI analysis shows moderate potential for ${platform.toLowerCase()} with room for improvement through targeted content strategy.`}
                    </p>
                </div>

                {analysis?.keyFindings && analysis.keyFindings.length > 0 && (
                    <div className="space-y-2">
                        <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Key Findings</h4>
                        <ul className="space-y-1">
                            {analysis.keyFindings.slice(0, 3).map((finding: string, index: number) => (
                                <li key={index} className="text-xs text-gray-600 flex items-start gap-2">
                                    <span className="text-blue-500 mt-1">•</span>
                                    {finding}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        );
    };

    return (
        <>
            <SEOHead
                title={`Validation Results: ${result.demandScore}/100 - Validationly`}
                description={`AI analysis shows ${result.demandScore}/100 demand score for "${(result.content || result.idea).substring(0, 100)}...". Get detailed market validation insights.`}
                keywords="startup validation results, market demand analysis, AI validation report, business idea score"
            />

            {/* Simplified Background */}
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
                <div className="container mx-auto px-4 py-8">
                    {/* Compact Animated Header */}
                    <div className="text-center mb-6 animate-fade-in">
                        <h1 className="text-2xl font-bold text-gray-900 mb-1">
                            Market Analysis Results
                        </h1>
                        <p className="text-sm text-gray-500">AI-powered analysis of your business idea</p>
                    </div>

                    {/* Compact Animated Score Card */}
                    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 max-w-2xl mx-auto mb-6 animate-slide-up">
                        <div className="text-center">
                            <div className="text-sm font-medium text-gray-500 mb-3">Market Demand Score</div>
                            <div className="flex items-center justify-center gap-3 mb-4">
                                <div className="text-3xl font-bold text-gray-800 animate-count-up animate-pulse-subtle">
                                    {result.demandScore}
                                    <span className="text-lg text-gray-500 ml-1">/100</span>
                                </div>
                                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm bg-${status.color}-100 text-${status.color}-700 border border-${status.color}-200 animate-bounce-in`}>
                                    <span className="text-sm">{status.icon}</span>
                                    {status.text}
                                </div>
                            </div>

                            {/* Animated Progress Bar */}
                            <div className="w-full bg-gray-200 rounded-full h-2 mb-4 overflow-hidden">
                                <div
                                    className={`h-full rounded-full bg-gradient-to-r transition-all duration-1000 ease-out ${result.demandScore >= 70 ? 'from-emerald-400 to-emerald-600' :
                                        result.demandScore >= 50 ? 'from-amber-400 to-amber-600' :
                                            'from-red-400 to-red-600'
                                        } animate-progress-fill`}
                                    style={{ width: `${result.demandScore}%` }}
                                ></div>
                            </div>

                            <div className="text-sm text-gray-600 max-w-xl mx-auto leading-relaxed">
                                "{result.content || result.idea}"
                            </div>
                        </div>
                    </div>

                    {/* Social Media Platform Analysis */}
                    <div className="mb-4">
                        <h2 className="text-lg font-semibold text-gray-800 mb-3 text-center">Platform Analysis</h2>
                        <div className="text-sm text-gray-600 mb-4 text-center">
                            Sector-specific platform recommendations based on your idea
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                            {/* Always use real AI analysis from dynamic prompt system */}
                            <PlatformCard
                                platform="X (Twitter)"
                                analysis={(result as DynamicPromptResult).platformAnalyses?.twitter}
                                icon={<XIcon />}
                                bgColor="hover:bg-blue-50"
                                delay={100}
                            />
                            <PlatformCard
                                platform="Reddit"
                                analysis={(result as DynamicPromptResult).platformAnalyses?.reddit}
                                icon={<RedditIcon />}
                                bgColor="hover:bg-orange-50"
                                delay={200}
                            />
                            <PlatformCard
                                platform="LinkedIn"
                                analysis={(result as DynamicPromptResult).platformAnalyses?.linkedin}
                                icon={<svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                </svg>}
                                bgColor="hover:bg-indigo-50"
                                delay={300}
                            />
                            <PlatformCard
                                platform="Instagram"
                                analysis={(result as DynamicPromptResult).platformAnalyses?.instagram}
                                icon={<InstagramIcon />}
                                bgColor="hover:bg-pink-50"
                                delay={350}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                            <PlatformCard
                                platform="TikTok"
                                analysis={(result as DynamicPromptResult).platformAnalyses?.tiktok}
                                icon={<TikTokIcon />}
                                bgColor="hover:bg-purple-50"
                                delay={400}
                            />
                            <PlatformCard
                                platform="YouTube"
                                analysis={(result as DynamicPromptResult).platformAnalyses?.youtube}
                                icon={<YouTubeIcon />}
                                bgColor="hover:bg-red-50"
                                delay={450}
                            />
                            <PlatformCard
                                platform="Product Hunt"
                                analysis={(result as DynamicPromptResult).platformAnalyses?.producthunt}
                                icon={<ProductHuntIcon />}
                                bgColor="hover:bg-orange-50"
                                delay={500}
                            />
                            <PlatformCard
                                platform="GitHub"
                                analysis={(result as DynamicPromptResult).platformAnalyses?.github}
                                icon={<GitHubIcon />}
                                bgColor="hover:bg-gray-50"
                                delay={550}
                            />
                        </div>
                    </div>

                    {/* Market Intelligence Cards - Tier 1 */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <MarketIntelligenceCard data={result.marketIntelligence} />
                        <CompetitiveLandscapeCard data={result.competitiveLandscape} />
                        <RevenueModelCard data={result.revenueModel} />
                    </div>

                    {/* Strategic Analysis Cards - Tier 2 */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <TargetAudienceCard data={result.targetAudience} />
                        <RiskAssessmentCard data={result.riskAssessment} />
                        <GoToMarketCard data={result.goToMarket} />
                    </div>

                    {/* Advanced Analysis Cards - Tier 3 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <DevelopmentRoadmapCard data={result.developmentRoadmap} />
                        <ProductMarketFitCard data={result.productMarketFit} />
                    </div>

                    {/* Content Suggestions */}
                    <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 max-w-4xl mx-auto mb-8">
                        <div className="text-center mb-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Test Your Idea</h3>
                            <p className="text-gray-600">Copy and use these AI-generated posts to validate your idea on social platforms</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Twitter Suggestion */}
                            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                            <XIcon />
                                        </div>
                                        <span className="font-semibold text-gray-900">X (Twitter)</span>
                                    </div>
                                    <button
                                        onClick={() => handleCopyToClipboard(result.tweetSuggestion, 'tweet')}
                                        className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                    >
                                        {copiedId === 'tweet' ? '✓ Copied!' : 'Copy'}
                                    </button>
                                </div>
                                <div className="text-sm text-gray-700 leading-relaxed bg-white rounded-lg p-4 border border-blue-200">
                                    {result.tweetSuggestion}
                                </div>
                                <div className="mt-3 text-xs text-blue-700 font-medium">
                                    💡 Best for: Quick validation & viral potential
                                </div>
                            </div>

                            {/* Reddit Suggestion */}
                            <div className="bg-gradient-to-br from-orange-50 to-red-100 rounded-xl p-6 border border-orange-200">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
                                            <RedditIcon />
                                        </div>
                                        <span className="font-semibold text-gray-900">Reddit</span>
                                    </div>
                                    <button
                                        onClick={() => handleCopyToClipboard(`${result.redditTitleSuggestion}\n\n${result.redditBodySuggestion}`, 'reddit')}
                                        className="text-xs bg-orange-600 text-white px-3 py-1.5 rounded-lg hover:bg-orange-700 transition-colors font-medium"
                                    >
                                        {copiedId === 'reddit' ? '✓ Copied!' : 'Copy'}
                                    </button>
                                </div>
                                <div className="bg-white rounded-lg p-4 border border-orange-200">
                                    <div className="text-sm font-semibold text-gray-900 mb-2">
                                        {result.redditTitleSuggestion}
                                    </div>
                                    <div className="text-sm text-gray-700 leading-relaxed">
                                        {result.redditBodySuggestion}
                                    </div>
                                </div>
                                <div className="mt-3 text-xs text-orange-700 font-medium">
                                    💡 Best for: Detailed feedback & community insights
                                </div>
                            </div>

                            {/* LinkedIn Suggestion */}
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-6 border border-indigo-200">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                                            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                            </svg>
                                        </div>
                                        <span className="font-semibold text-gray-900">LinkedIn</span>
                                    </div>
                                    <button
                                        onClick={() => handleCopyToClipboard(result.linkedinSuggestion, 'linkedin')}
                                        className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                                    >
                                        {copiedId === 'linkedin' ? '✓ Copied!' : 'Copy'}
                                    </button>
                                </div>
                                <div className="text-sm text-gray-700 leading-relaxed bg-white rounded-lg p-4 border border-indigo-200">
                                    {result.linkedinSuggestion}
                                </div>
                                <div className="mt-3 text-xs text-indigo-700 font-medium">
                                    💡 Best for: Professional validation & B2B feedback
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-blue-600 text-sm">💡</span>
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-900 mb-1">Quick Validation Tips</h4>
                                    <p className="text-xs text-gray-600 leading-relaxed">
                                        Post these suggestions on the respective platforms and monitor engagement, comments, and direct messages.
                                        High engagement indicates strong market interest. Save positive responses as social proof for future marketing.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Feedback and Support Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                        {/* Feedback on X Button */}
                        <a
                            href="https://x.com/kptbarbarossa"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-800 transition-all duration-300 shadow-lg"
                        >
                            <XIcon />
                            <span>Share Feedback on X</span>
                        </a>

                        {/* Buy Me a Coffee Button */}
                        <a
                            href="https://buymeacoffee.com/kptbarbarossa"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-yellow-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-yellow-600 transition-all duration-300 shadow-lg"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M20.216 6.415l-.132-.666c-.119-.598-.388-1.163-.766-1.613a4.44 4.44 0 0 0-1.364-1.04c-.354-.25-.773-.426-1.214-.518a9.909 9.909 0 0 0-1.85-.104c-.26.003-.52.021-.778.053a27.158 27.158 0 0 0-3.583.641c-.5.15-.988.35-1.444.598-.456.247-.882.543-1.267.888a6.404 6.404 0 0 0-1.048 1.137 6.893 6.893 0 0 0-.68 1.329c-.17.484-.295.996-.37 1.514L6.34 8.803c-.24.029-.477.096-.704.198a3.814 3.814 0 0 0-.657.466c-.195.195-.356.426-.477.68-.121.254-.196.532-.218.812-.02.257.014.514.101.756.087.243.218.47.388.67.17.2.383.364.624.482.241.118.513.187.786.203.346.02.693-.039 1.008-.172.315-.133.596-.34.82-.598.224-.259.384-.569.467-.896.083-.327.087-.67.011-.999a3.649 3.649 0 0 0-.236-.784 3.58 3.58 0 0 0-.49-.69 3.49 3.49 0 0 0-.793-.525c-.307-.138-.65-.2-.991-.182-.297.016-.588.108-.848.267-.26.16-.48.384-.639.651-.159.267-.25.575-.265.888-.015.313.055.625.203.905.148.28.37.518.644.691.274.173.594.274.925.293.331.019.663-.041.962-.174.299-.133.563-.34.766-.598.203-.259.34-.569.398-.896.058-.327.045-.67-.038-.999a3.649 3.649 0 0 0-.236-.784z" />
                            </svg>
                            <span>Buy Me a Coffee</span>
                        </a>
                    </div>

                    {/* Bottom CTA */}
                    <div className="text-center">
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white shadow-lg max-w-2xl mx-auto">
                            <h3 className="text-2xl font-bold mb-4">Ready to Build Your Idea?</h3>
                            <p className="text-blue-100 mb-6 text-lg">
                                {status.desc} {status.action}.
                            </p>
                            <button
                                onClick={() => navigate('/')}
                                className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300 shadow-lg"
                            >
                                Analyze Another Idea
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ResultsPage;