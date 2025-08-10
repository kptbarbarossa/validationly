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
    const isTR = ((result as any)?.language || '').toLowerCase().includes('turk');

    // Map score to width classes (5% steps) to avoid inline styles
    const widthClassMap: Record<number, string> = {
        0: 'w-0', 5: 'w-[5%]', 10: 'w-[10%]', 15: 'w-[15%]', 20: 'w-[20%]',
        25: 'w-[25%]', 30: 'w-[30%]', 35: 'w-[35%]', 40: 'w-[40%]', 45: 'w-[45%]',
        50: 'w-[50%]', 55: 'w-[55%]', 60: 'w-[60%]', 65: 'w-[65%]', 70: 'w-[70%]',
        75: 'w-[75%]', 80: 'w-[80%]', 85: 'w-[85%]', 90: 'w-[90%]', 95: 'w-[95%]',
        100: 'w-[100%]'
    };
    // Safelist for Tailwind JIT (do not remove)
    const TAILWIND_WIDTH_SAFELIST = 'w-0 w-[5%] w-[10%] w-[15%] w-[20%] w-[25%] w-[30%] w-[35%] w-[40%] w-[45%] w-[50%] w-[55%] w-[60%] w-[65%] w-[70%] w-[75%] w-[80%] w-[85%] w-[90%] w-[95%] w-[100%]';
    const getProgressWidthClass = (score: number): string => {
        const clamped = Math.max(0, Math.min(100, Math.round(score / 5) * 5));
        return widthClassMap[clamped as keyof typeof widthClassMap] || 'w-0';
    };

    // Platform icon mapping function
    const getPlatformIcon = (platformName: string) => {
        const name = platformName.toLowerCase();
        switch (name) {
            // Core platforms
            case 'twitter': case 'x': return <XIcon />;
            case 'reddit': return <RedditIcon />;
            case 'linkedin': return <div className="w-4 h-4 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">in</div>;
            
            // Social platforms
            case 'instagram': return <InstagramIcon />;
            case 'tiktok': return <TikTokIcon />;
            case 'youtube': return <YouTubeIcon />;
            case 'facebook': return <FacebookIcon />;
            
            // Tech & startup platforms
            case 'product hunt': case 'producthunt': return <ProductHuntIcon />;
            case 'hacker news': case 'hackernews': return <HackerNewsIcon />;
            case 'medium': return <MediumIcon />;
            case 'discord': return <DiscordIcon />;
            case 'github': return <GitHubIcon />;
            case 'stack overflow': case 'stackoverflow': return <StackOverflowIcon />;
            
            // Phase 2 platforms
            case 'pinterest': return <PinterestIcon />;
            case 'angellist': return <AngelListIcon />;
            case 'crunchbase': return <CrunchbaseIcon />;
            case 'dribbble': return <DribbbleIcon />;
            case 'behance': return <BehanceIcon />;
            case 'figma community': case 'figma': return <FigmaIcon />;
            
            // Phase 3 - Professional & Business
            case 'slack communities': case 'slack': return <SlackIcon />;
            case 'clubhouse': return <ClubhouseIcon />;
            case 'substack': return <SubstackIcon />;
            case 'notion community': case 'notion': return <NotionIcon />;
            
            // Phase 3 - Developer & Tech
            case 'dev.to': case 'devto': return <DevToIcon />;
            case 'hashnode': return <HashnodeIcon />;
            case 'gitlab': return <GitLabIcon />;
            case 'codepen': return <CodePenIcon />;
            case 'indie hackers': case 'indiehackers': return <IndieHackersIcon />;
            
            // Phase 3 - Creative & Design
            case 'awwwards': return <AwwwardsIcon />;
            case '99designs': case 'designs99': return <Designs99Icon />;
            case 'canva community': case 'canva': return <CanvaIcon />;
            case 'adobe community': case 'adobe': return <AdobeIcon />;
            case 'unsplash': return <UnsplashIcon />;
            
            // Phase 3 - E-commerce & Retail
            case 'etsy': return <EtsyIcon />;
            case 'amazon seller central': case 'amazon': return <AmazonIcon />;
            case 'shopify community': case 'shopify': return <ShopifyIcon />;
            case 'woocommerce': return <WooCommerceIcon />;
            
            default: return <div className="w-4 h-4 bg-gray-400 rounded"></div>;
        }
    };

    // All results are now from dynamic prompt system
    type PlatformKey = keyof DynamicPromptResult['platformAnalyses'];

    const PLATFORM_DEFS: Array<{ key: PlatformKey; label: string; icon: React.ReactNode; bg: string }> = [
        { key: 'twitter', label: 'X (Twitter)', icon: <XIcon />, bg: 'hover:bg-blue-500/10' },
        { key: 'reddit', label: 'Reddit', icon: <RedditIcon />, bg: 'hover:bg-orange-500/10' },
        { key: 'linkedin', label: 'LinkedIn', icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>, bg: 'hover:bg-indigo-500/10' },
        { key: 'instagram', label: 'Instagram', icon: <InstagramIcon />, bg: 'hover:bg-pink-500/10' },
        { key: 'tiktok', label: 'TikTok', icon: <TikTokIcon />, bg: 'hover:bg-purple-500/10' },
        { key: 'youtube', label: 'YouTube', icon: <YouTubeIcon />, bg: 'hover:bg-red-500/10' },
        { key: 'facebook', label: 'Facebook', icon: <FacebookIcon />, bg: 'hover:bg-blue-500/10' },
        { key: 'producthunt', label: 'Product Hunt', icon: <ProductHuntIcon />, bg: 'hover:bg-orange-500/10' },
        { key: 'hackernews', label: 'Hacker News', icon: <HackerNewsIcon />, bg: 'hover:bg-orange-500/10' },
        { key: 'medium', label: 'Medium', icon: <MediumIcon />, bg: 'hover:bg-slate-500/10' },
        { key: 'discord', label: 'Discord', icon: <DiscordIcon />, bg: 'hover:bg-indigo-500/10' },
        { key: 'github', label: 'GitHub', icon: <GitHubIcon />, bg: 'hover:bg-slate-500/10' },
        { key: 'stackoverflow', label: 'Stack Overflow', icon: <StackOverflowIcon />, bg: 'hover:bg-amber-500/10' },
        { key: 'pinterest', label: 'Pinterest', icon: <PinterestIcon />, bg: 'hover:bg-rose-500/10' },
        { key: 'angellist', label: 'AngelList', icon: <AngelListIcon />, bg: 'hover:bg-emerald-500/10' },
        { key: 'crunchbase', label: 'Crunchbase', icon: <CrunchbaseIcon />, bg: 'hover:bg-cyan-500/10' },
        { key: 'dribbble', label: 'Dribbble', icon: <DribbbleIcon />, bg: 'hover:bg-pink-500/10' },
        { key: 'behance', label: 'Behance', icon: <BehanceIcon />, bg: 'hover:bg-blue-500/10' },
        { key: 'figma', label: 'Figma Community', icon: <FigmaIcon />, bg: 'hover:bg-green-500/10' },
        { key: 'slack', label: 'Slack Communities', icon: <SlackIcon />, bg: 'hover:bg-fuchsia-500/10' },
        { key: 'clubhouse', label: 'Clubhouse', icon: <ClubhouseIcon />, bg: 'hover:bg-amber-500/10' },
        { key: 'substack', label: 'Substack', icon: <SubstackIcon />, bg: 'hover:bg-orange-500/10' },
        { key: 'notion', label: 'Notion Community', icon: <NotionIcon />, bg: 'hover:bg-slate-500/10' },
        { key: 'devto', label: 'Dev.to', icon: <DevToIcon />, bg: 'hover:bg-slate-500/10' },
        { key: 'hashnode', label: 'Hashnode', icon: <HashnodeIcon />, bg: 'hover:bg-blue-500/10' },
        { key: 'gitlab', label: 'GitLab', icon: <GitLabIcon />, bg: 'hover:bg-orange-500/10' },
        { key: 'codepen', label: 'CodePen', icon: <CodePenIcon />, bg: 'hover:bg-teal-500/10' },
        { key: 'indiehackers', label: 'Indie Hackers', icon: <IndieHackersIcon />, bg: 'hover:bg-indigo-500/10' },
        { key: 'awwwards', label: 'Awwwards', icon: <AwwwardsIcon />, bg: 'hover:bg-emerald-500/10' },
        { key: 'designs99', label: '99designs', icon: <Designs99Icon />, bg: 'hover:bg-purple-500/10' },
        { key: 'canva', label: 'Canva Community', icon: <CanvaIcon />, bg: 'hover:bg-cyan-500/10' },
        { key: 'adobe', label: 'Adobe Community', icon: <AdobeIcon />, bg: 'hover:bg-red-500/10' },
        { key: 'unsplash', label: 'Unsplash', icon: <UnsplashIcon />, bg: 'hover:bg-slate-500/10' },
        { key: 'etsy', label: 'Etsy', icon: <EtsyIcon />, bg: 'hover:bg-orange-500/10' },
        { key: 'amazon', label: 'Amazon Seller Central', icon: <AmazonIcon />, bg: 'hover:bg-yellow-500/10' },
        { key: 'shopify', label: 'Shopify Community', icon: <ShopifyIcon />, bg: 'hover:bg-green-500/10' },
        { key: 'woocommerce', label: 'WooCommerce', icon: <WooCommerceIcon />, bg: 'hover:bg-fuchsia-500/10' },
    ];

    const platformAnalysesObj = (result as DynamicPromptResult).platformAnalyses as any;
    const [showAllPlatforms, setShowAllPlatforms] = useState(false);
    const availablePlatformDefs = PLATFORM_DEFS.filter(def => {
        const a = platformAnalysesObj?.[def.key];
        return Boolean(a && (typeof a.summary === 'string' ? a.summary.trim().length > 0 : true));
    });
    const sortedPlatformDefs = availablePlatformDefs
        .map(def => ({ def, score: Math.max(1, Math.min(5, Number(platformAnalysesObj?.[def.key]?.score || 0))) }))
        .sort((a, b) => b.score - a.score)
        .map(x => x.def);
    const visiblePlatformDefs = showAllPlatforms ? sortedPlatformDefs : sortedPlatformDefs.slice(0, 8);

    const chunk = <T,>(arr: T[], size: number): T[][] => {
        const out: T[][] = [];
        for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
        return out;
    };

    // Market Intelligence Card Component
    const MarketIntelligenceCard: React.FC<{ data?: any }> = ({ data }) => (
        <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 shadow-2xl border border-white/10 hover:bg-green-500/10 animate-card-hover animate-card-entrance delay-400">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <TrendUpIcon />
                </div>
                <div>
                    <h3 className="font-semibold text-white">Market Intelligence</h3>
                    <div className="text-sm text-green-300 font-medium">Market Opportunity</div>
                </div>
            </div>
            <div className="space-y-3">
                <div className="text-sm">
                    <span className="font-medium text-slate-300">TAM:</span>
                    <span className="text-slate-300 ml-2">{data?.tam || '$2.5B Design Software Market'}</span>
                </div>
                <div className="text-sm">
                    <span className="font-medium text-slate-300">SAM:</span>
                    <span className="text-slate-300 ml-2">{data?.sam || '$450M SaaS Design Tools'}</span>
                </div>
                <div className="text-sm">
                    <span className="font-medium text-slate-300">SOM:</span>
                    <span className="text-slate-300 ml-2">{data?.som || '$12M Realistic 3-year target'}</span>
                </div>
                <div className="text-sm">
                    <span className="font-medium text-slate-300">Growth:</span>
                    <span className="text-green-300 ml-2 font-medium">{data?.growthRate || '15% YoY'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium text-slate-300">Timing:</span>
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
        <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 shadow-2xl border border-white/10 hover:bg-red-500/10 animate-card-hover animate-card-entrance delay-500">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                    <span className="text-red-300 font-bold">🥊</span>
                </div>
                <div>
                    <h3 className="font-semibold text-white">Competition Analysis</h3>
                    <div className="text-sm text-red-300 font-medium">Competitive Landscape</div>
                </div>
            </div>
            <div className="space-y-3">
                <div className="text-sm">
                    <span className="font-medium text-slate-300">Direct Competitors:</span>
                    <div className="text-slate-300 mt-1">
                        {data?.directCompetitors?.join(', ') || 'Figma, Sketch, Adobe XD'}
                    </div>
                </div>
                <div className="text-sm">
                    <span className="font-medium text-slate-300">Position:</span>
                    <span className="text-slate-300 ml-2">{data?.marketPosition || 'Blue Ocean Opportunity'}</span>
                </div>
                <div className="text-sm">
                    <span className="font-medium text-slate-300">Differentiation:</span>
                    <span className="text-blue-300 ml-2 font-medium">{data?.differentiationScore || '8'}/10</span>
                </div>
                <div className="text-sm">
                    <span className="font-medium text-slate-300">Moat:</span>
                    <span className="text-slate-300 ml-2">{data?.competitiveMoat || 'AI-powered features'}</span>
                </div>
            </div>
        </div>
    );

    // Revenue Model Card Component
    const RevenueModelCard: React.FC<{ data?: any }> = ({ data }) => (
        <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 shadow-2xl border border-white/10 hover:bg-yellow-500/10 animate-card-hover animate-card-entrance delay-600">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                    <span className="text-yellow-300 font-bold">💰</span>
                </div>
                <div>
                    <h3 className="font-semibold text-white">Revenue Model</h3>
                    <div className="text-sm text-yellow-300 font-medium">Monetization Strategy</div>
                </div>
            </div>
            <div className="space-y-3">
                <div className="text-sm">
                    <span className="font-medium text-slate-300">Model:</span>
                    <span className="text-slate-300 ml-2">{data?.primaryModel || 'Freemium SaaS'}</span>
                </div>
                <div className="text-sm">
                    <span className="font-medium text-slate-300">Price:</span>
                    <span className="text-green-300 ml-2 font-medium">{data?.pricePoint || '$29/month'}</span>
                </div>
                <div className="text-sm">
                    <span className="font-medium text-slate-300">Break-even:</span>
                    <span className="text-slate-300 ml-2">{data?.breakEvenTimeline || '18 months'}</span>
                </div>
                <div className="text-sm">
                    <span className="font-medium text-slate-300">LTV/CAC:</span>
                    <span className="text-blue-300 ml-2 font-medium">{data?.ltvCacRatio || '4.2x'}</span>
                </div>
                <div className="text-sm">
                    <span className="font-medium text-slate-300">Projected MRR:</span>
                    <span className="text-green-300 ml-2 font-medium">{data?.projectedMrr || '$25K by Year 1'}</span>
                </div>
            </div>
        </div>
    );

    // Target Audience Card Component
    const TargetAudienceCard: React.FC<{ data?: any }> = ({ data }) => (
        <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 shadow-2xl border border-white/10 hover:bg-purple-500/10">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <span className="text-purple-300 font-bold">👥</span>
                </div>
                <div>
                    <h3 className="font-semibold text-white">Target Audience</h3>
                    <div className="text-sm text-purple-300 font-medium">Customer Segments</div>
                </div>
            </div>
            <div className="space-y-3">
                <div className="text-sm">
                    <span className="font-medium text-slate-300">Primary:</span>
                    <span className="text-slate-300 ml-2">{data?.primarySegment || 'Freelance Designers (40%)'}</span>
                </div>
                <div className="text-sm">
                    <span className="font-medium text-slate-300">Secondary:</span>
                    <span className="text-slate-300 ml-2">{data?.secondarySegment || 'Design Agencies (35%)'}</span>
                </div>
                <div className="text-sm">
                    <span className="font-medium text-slate-300">Pain Points:</span>
                    <div className="text-slate-300 mt-1">
                        {data?.painPoints?.join(', ') || 'Project chaos, client communication'}
                    </div>
                </div>
                <div className="text-sm">
                    <span className="font-medium text-slate-300">Willingness to Pay:</span>
                    <span className="text-green-300 ml-2 font-medium">{data?.willingnessToPay || 'High ($25-50/month)'}</span>
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
            <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 shadow-2xl border border-white/10 hover:bg-orange-500/10">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                        <span className="text-orange-300 font-bold">⚠️</span>
                    </div>
                    <div>
                        <h3 className="font-semibold text-white">Risk Assessment</h3>
                        <div className="text-sm text-orange-300 font-medium">Risk Matrix</div>
                    </div>
                </div>
                <div className="space-y-3">
                    <div className="text-sm">
                        <span className="font-medium text-slate-300">Technical:</span>
                        <span className={`ml-2 font-medium ${getRiskColor(data?.technicalRisk || 'Low')}`}>
                            {data?.technicalRisk || 'Low'}
                        </span>
                    </div>
                    <div className="text-sm">
                        <span className="font-medium text-slate-300">Market:</span>
                        <span className={`ml-2 font-medium ${getRiskColor(data?.marketRisk || 'Medium')}`}>
                            {data?.marketRisk || 'Medium'}
                        </span>
                    </div>
                    <div className="text-sm">
                        <span className="font-medium text-slate-300">Financial:</span>
                        <span className={`ml-2 font-medium ${getRiskColor(data?.financialRisk || 'Low')}`}>
                            {data?.financialRisk || 'Low'}
                        </span>
                    </div>
                    <div className="text-sm border-t pt-2">
                        <span className="font-medium text-slate-300">Overall:</span>
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
        <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 shadow-2xl border border-white/10 hover:bg-indigo-500/10">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center">
                    <span className="text-indigo-300 font-bold">🚀</span>
                </div>
                <div>
                    <h3 className="font-semibold text-white">Go-to-Market</h3>
                    <div className="text-sm text-indigo-300 font-medium">Launch Strategy</div>
                </div>
            </div>
            <div className="space-y-3">
                <div className="text-sm">
                    <span className="font-medium text-slate-300">Phase 1:</span>
                    <span className="text-slate-300 ml-2">{data?.phase1 || 'Design Twitter + Product Hunt'}</span>
                </div>
                <div className="text-sm">
                    <span className="font-medium text-slate-300">Phase 2:</span>
                    <span className="text-slate-300 ml-2">{data?.phase2 || 'Design communities (Dribbble, Behance)'}</span>
                </div>
                <div className="text-sm">
                    <span className="font-medium text-slate-300">Phase 3:</span>
                    <span className="text-slate-300 ml-2">{data?.phase3 || 'Partnership with design schools'}</span>
                </div>
                <div className="text-sm">
                    <span className="font-medium text-slate-300">Timeline:</span>
                    <span className="text-blue-300 ml-2 font-medium">{data?.timeline || '6-month rollout'}</span>
                </div>
                <div className="text-sm">
                    <span className="font-medium text-slate-300">Budget:</span>
                    <span className="text-green-300 ml-2 font-medium">{data?.budgetNeeded || '$50K initial'}</span>
                </div>
            </div>
        </div>
    );

    // Development Roadmap Card Component
    const DevelopmentRoadmapCard: React.FC<{ data?: any }> = ({ data }) => (
        <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 shadow-2xl border border-white/10 hover:bg-teal-500/10">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-teal-500/20 rounded-lg flex items-center justify-center">
                    <span className="text-teal-300 font-bold">🛠️</span>
                </div>
                <div>
                    <h3 className="font-semibold text-white">Development Roadmap</h3>
                    <div className="text-sm text-teal-300 font-medium">Build Timeline</div>
                </div>
            </div>
            <div className="space-y-3">
                <div className="text-sm">
                    <span className="font-medium text-slate-300">MVP:</span>
                    <span className="text-slate-300 ml-2">{data?.mvpTimeline || '3 months'}</span>
                </div>
                <div className="text-sm">
                    <span className="font-medium text-slate-300">Beta:</span>
                    <span className="text-slate-300 ml-2">{data?.betaLaunch || '5 months'}</span>
                </div>
                <div className="text-sm">
                    <span className="font-medium text-slate-300">Launch:</span>
                    <span className="text-blue-300 ml-2 font-medium">{data?.publicLaunch || '8 months'}</span>
                </div>
                <div className="text-sm">
                    <span className="font-medium text-slate-300">Team:</span>
                    <div className="text-slate-300 mt-1">
                        {data?.teamNeeded?.join(', ') || '2 developers, 1 designer'}
                    </div>
                </div>
                <div className="text-sm">
                    <span className="font-medium text-slate-300">Tech Stack:</span>
                    <div className="text-slate-300 mt-1">
                        {data?.techStack?.join(', ') || 'React, Node.js, PostgreSQL'}
                    </div>
                </div>
            </div>
        </div>
    );

    // Product-Market Fit Card Component
    const ProductMarketFitCard: React.FC<{ data?: any }> = ({ data }) => (
        <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 shadow-2xl border border-white/10 hover:bg-pink-500/10">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-pink-500/20 rounded-lg flex items-center justify-center">
                    <span className="text-pink-300 font-bold">🎯</span>
                </div>
                <div>
                    <h3 className="font-semibold text-white">Product-Market Fit</h3>
                    <div className="text-sm text-pink-300 font-medium">PMF Indicators</div>
                </div>
            </div>
            <div className="space-y-3">
                <div className="text-sm">
                    <span className="font-medium text-slate-300">Problem-Solution Fit:</span>
                    <span className="text-green-300 ml-2 font-medium">{data?.problemSolutionFit || '85'}%</span>
                </div>
                <div className="text-sm">
                    <span className="font-medium text-slate-300">Solution-Market Fit:</span>
                    <span className="text-blue-300 ml-2 font-medium">{data?.solutionMarketFit || '78'}%</span>
                </div>
                <div className="text-sm">
                    <span className="font-medium text-slate-300">Early Adopters:</span>
                    <span className="text-slate-300 ml-2">{data?.earlyAdopterSignals || 'Strong signals'}</span>
                </div>
                <div className="text-sm">
                    <span className="font-medium text-slate-300">Retention:</span>
                    <span className="text-slate-300 ml-2">{data?.retentionPrediction || '65% (Month 1)'}</span>
                </div>
                <div className="text-sm">
                    <span className="font-medium text-slate-300">Viral Coefficient:</span>
                    <span className="text-purple-300 ml-2 font-medium">{data?.viralCoefficient || '0.3'}</span>
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
            if (score >= 4) return isTR ? 'Mükemmel' : 'Excellent';
            if (score >= 3) return isTR ? 'İyi' : 'Good';
            if (score >= 2) return isTR ? 'Orta' : 'Fair';
            return isTR ? 'Zayıf' : 'Poor';
        };

        return (
            <div
                className={`rounded-2xl glass glass-border p-6 border border-white/10 ${bgColor} animate-card-hover animate-card-entrance ${delay === 100 ? 'delay-100' : ''} ${delay === 200 ? 'delay-200' : ''} ${delay === 300 ? 'delay-300' : ''} ${delay === 350 ? 'delay-350' : ''} ${delay === 400 ? 'delay-400' : ''} ${delay === 450 ? 'delay-450' : ''} ${delay === 500 ? 'delay-500' : ''} ${delay === 550 ? 'delay-550' : ''}`}
            >
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/10">
                        {icon}
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-100">{platform}</h3>
                        <div className={`text-sm font-medium ${getScoreColor(analysis?.score || 3)}`}>
                            {analysis?.score || 3}/5 - {getScoreText(analysis?.score || 3)}
                        </div>
                    </div>
                </div>

                <div className="mb-4">
                    <p className="text-sm text-slate-300 leading-relaxed glass-scroll">
                        {analysis?.summary || (
                            (result as any)?.language === 'Turkish'
                                ? `Yapay zeka analizi ${platform.toLowerCase()} için orta düzey potansiyel gösteriyor. Hedefli içerik stratejisi ile iyileştirme alanı mevcut.`
                                : `AI analysis shows moderate potential for ${platform.toLowerCase()} with room for improvement through targeted content strategy.`
                        )}
                    </p>
                </div>

                {analysis?.keyFindings && analysis.keyFindings.length > 0 && (
                    <div className="space-y-2">
                        <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wide">{isTR ? 'Önemli Bulgular' : 'Key Findings'}</h4>
                        <ul className="space-y-1">
                            {analysis.keyFindings.slice(0, 3).map((finding: string, index: number) => (
                                <li key={index} className="text-xs text-slate-300 flex items-start gap-2">
                                    <span className="text-blue-300 mt-1">•</span>
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

            {/* Enhanced Background - Dark + Glassmorphism + Spotlight */}
            <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 overflow-hidden" onMouseMove={(e)=>{ const r = (e.currentTarget as HTMLDivElement).style; r.setProperty('--sx', e.clientX+'px'); r.setProperty('--sy', e.clientY+'px'); }}>
                {/* Fallback notice */}
                {Boolean((result as any)?.fallbackUsed) && (
                    <div className="max-w-3xl mx-auto mb-4 p-3 rounded-lg border border-amber-400/30 bg-amber-500/10 text-amber-300 text-sm">
                        {(result as any)?.language === 'Turkish'
                            ? 'Not: Analiz geçici yedek modda oluşturuldu. Daha doğru sonuçlar için tekrar deneyin.'
                            : 'Note: Analysis used fallback mode. Please try again for more accurate results.'}
                    </div>
                )}
                {/* Background gradient overlay */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-indigo-600/25 via-indigo-500/10 to-cyan-600/25 blur-3xl"></div>
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-900/40 to-transparent"></div>
                <div className="pointer-events-none absolute -top-40 -left-40 w-[40rem] h-[40rem] bg-indigo-500/25 rounded-full blur-3xl animate-aurora-slower"></div>
                <div className="pointer-events-none absolute -bottom-40 -right-40 w-[44rem] h-[44rem] bg-cyan-500/25 rounded-full blur-3xl animate-aurora-slowest"></div>
                <div className="pointer-events-none absolute inset-0 cursor-spotlight"></div>
                
                <div className="relative z-10 container mx-auto px-4 py-8">
                    {/* Compact Animated Header */}
                    <div className="text-center mb-6 animate-fade-in">
                        <h1 className="text-2xl font-bold text-white mb-1">
                            Market Analysis Results
                        </h1>
                        <p className="text-sm text-slate-300">AI-powered analysis of your business idea</p>
                    </div>

                    {/* Premium Score Card: Circular Gauge */}
                    <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.6)] border border-white/10 max-w-2xl mx-auto mb-6 animate-slide-up">
                        <div className="text-center">
                            <div className="text-sm font-medium text-slate-300 mb-5">Market Demand Score</div>
                            <div className="flex items-center justify-center gap-6 mb-4">
                                <div className="relative w-40 h-40">
                                    <div className={`absolute inset-0 gauge-ring ${result.demandScore>=70? 'gauge-green' : result.demandScore>=50? 'gauge-amber' : 'gauge-red'}`} data-progress={result.demandScore} />
                                    <div className="absolute inset-3 gauge-inner flex items-center justify-center">
                                        <div className="text-4xl font-bold text-white leading-none">
                                    {result.demandScore}
                                            <span className="block text-xs text-slate-300 mt-1">/100</span>
                                </div>
                                    </div>
                                </div>
                                <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold shadow-sm bg-${status.color}-100 text-${status.color}-700 border border-${status.color}-200 animate-bounce-in`}>
                                    <span className="text-base">{status.icon}</span>
                                    {status.text}
                                </div>
                            </div>

                            <div className="text-sm text-slate-200 max-w-xl mx-auto leading-relaxed">
                                "{result.content || result.idea}"
                            </div>
                        </div>
                    </div>

                    {/* Social Media Platform Analysis */}
                    <div className="mb-4">
                        <h2 className="text-lg font-semibold text-white mb-3 text-center">Platform Analysis</h2>
                        <div className="text-sm text-slate-300 mb-4 text-center">
                            Sector-specific platform recommendations based on your idea
                        </div>
                        <div className="flex items-center justify-between mb-4">
                            <div className="text-sm text-slate-300">
                                Platform cards sorted by score {showAllPlatforms ? '' : '(Top 8)'}
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => setShowAllPlatforms(v => !v)}
                                    className="text-xs px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 text-slate-200"
                                >
                                    {showAllPlatforms ? 'Show Top 8' : 'Show All'}
                                </button>
                            </div>
                        </div>

                        {chunk(visiblePlatformDefs, 4).map((row, rowIdx) => (
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6" key={rowIdx}>
                                {row.map((def, idx) => {
                                    const analysis = platformAnalysesObj?.[def.key];
                                    const delay = 100 + (rowIdx * 4 + idx) * 50;
                                    return (
                                        <PlatformCard
                                            key={def.key}
                                            platform={def.label}
                                            analysis={analysis}
                                            icon={def.icon}
                                            bgColor={def.bg}
                                            delay={delay}
                                        />
                                    );
                                })}
                            </div>
                        ))}

                        {/* Additional Platform Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                            <PlatformCard
                                platform="Facebook"
                                analysis={(result as DynamicPromptResult).platformAnalyses?.facebook}
                                icon={<FacebookIcon />}
                                bgColor="hover:bg-blue-500/10"
                                delay={100}
                            />
                            <PlatformCard
                                platform="Pinterest"
                                analysis={(result as DynamicPromptResult).platformAnalyses?.pinterest}
                                icon={<PinterestIcon />}
                                bgColor="hover:bg-rose-500/10"
                                delay={150}
                            />
                            <PlatformCard
                                platform="Stack Overflow"
                                analysis={(result as DynamicPromptResult).platformAnalyses?.stackoverflow}
                                icon={<StackOverflowIcon />}
                                bgColor="hover:bg-amber-500/10"
                                delay={200}
                            />
                            <PlatformCard
                                platform="Hacker News"
                                analysis={(result as DynamicPromptResult).platformAnalyses?.hackernews}
                                icon={<HackerNewsIcon />}
                                bgColor="hover:bg-orange-500/10"
                                delay={250}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                            <PlatformCard
                                platform="Medium"
                                analysis={(result as DynamicPromptResult).platformAnalyses?.medium}
                                icon={<MediumIcon />}
                                bgColor="hover:bg-slate-500/10"
                                delay={300}
                            />
                            <PlatformCard
                                platform="Discord"
                                analysis={(result as DynamicPromptResult).platformAnalyses?.discord}
                                icon={<DiscordIcon />}
                                bgColor="hover:bg-indigo-500/10"
                                delay={350}
                            />
                            <PlatformCard
                                platform="AngelList"
                                analysis={(result as DynamicPromptResult).platformAnalyses?.angellist}
                                icon={<AngelListIcon />}
                                bgColor="hover:bg-emerald-500/10"
                                delay={400}
                            />
                            <PlatformCard
                                platform="Crunchbase"
                                analysis={(result as DynamicPromptResult).platformAnalyses?.crunchbase}
                                icon={<CrunchbaseIcon />}
                                bgColor="hover:bg-cyan-500/10"
                                delay={450}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                            <PlatformCard
                                platform="Dribbble"
                                analysis={(result as DynamicPromptResult).platformAnalyses?.dribbble}
                                icon={<DribbbleIcon />}
                                bgColor="hover:bg-pink-500/10"
                                delay={100}
                            />
                            <PlatformCard
                                platform="Behance"
                                analysis={(result as DynamicPromptResult).platformAnalyses?.behance}
                                icon={<BehanceIcon />}
                                bgColor="hover:bg-blue-500/10"
                                delay={150}
                            />
                            <PlatformCard
                                platform="Figma Community"
                                analysis={(result as DynamicPromptResult).platformAnalyses?.figma}
                                icon={<FigmaIcon />}
                                bgColor="hover:bg-green-500/10"
                                delay={200}
                            />
                            <PlatformCard
                                platform="Slack Communities"
                                analysis={(result as DynamicPromptResult).platformAnalyses?.slack}
                                icon={<SlackIcon />}
                                bgColor="hover:bg-fuchsia-500/10"
                                delay={250}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                            <PlatformCard
                                platform="Clubhouse"
                                analysis={(result as DynamicPromptResult).platformAnalyses?.clubhouse}
                                icon={<ClubhouseIcon />}
                                bgColor="hover:bg-amber-500/10"
                                delay={300}
                            />
                            <PlatformCard
                                platform="Substack"
                                analysis={(result as DynamicPromptResult).platformAnalyses?.substack}
                                icon={<SubstackIcon />}
                                bgColor="hover:bg-orange-500/10"
                                delay={350}
                            />
                            <PlatformCard
                                platform="Notion Community"
                                analysis={(result as DynamicPromptResult).platformAnalyses?.notion}
                                icon={<NotionIcon />}
                                bgColor="hover:bg-slate-500/10"
                                delay={400}
                            />
                            <PlatformCard
                                platform="Dev.to"
                                analysis={(result as DynamicPromptResult).platformAnalyses?.devto}
                                icon={<DevToIcon />}
                                bgColor="hover:bg-slate-500/10"
                                delay={450}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                            <PlatformCard
                                platform="Hashnode"
                                analysis={(result as DynamicPromptResult).platformAnalyses?.hashnode}
                                icon={<HashnodeIcon />}
                                bgColor="hover:bg-blue-500/10"
                                delay={100}
                            />
                            <PlatformCard
                                platform="GitLab"
                                analysis={(result as DynamicPromptResult).platformAnalyses?.gitlab}
                                icon={<GitLabIcon />}
                                bgColor="hover:bg-orange-500/10"
                                delay={150}
                            />
                            <PlatformCard
                                platform="CodePen"
                                analysis={(result as DynamicPromptResult).platformAnalyses?.codepen}
                                icon={<CodePenIcon />}
                                bgColor="hover:bg-teal-500/10"
                                delay={200}
                            />
                            <PlatformCard
                                platform="Indie Hackers"
                                analysis={(result as DynamicPromptResult).platformAnalyses?.indiehackers}
                                icon={<IndieHackersIcon />}
                                bgColor="hover:bg-indigo-500/10"
                                delay={250}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                            <PlatformCard
                                platform="Awwwards"
                                analysis={(result as DynamicPromptResult).platformAnalyses?.awwwards}
                                icon={<AwwwardsIcon />}
                                bgColor="hover:bg-emerald-500/10"
                                delay={300}
                            />
                            <PlatformCard
                                platform="99designs"
                                analysis={(result as DynamicPromptResult).platformAnalyses?.designs99}
                                icon={<Designs99Icon />}
                                bgColor="hover:bg-purple-500/10"
                                delay={350}
                            />
                            <PlatformCard
                                platform="Canva Community"
                                analysis={(result as DynamicPromptResult).platformAnalyses?.canva}
                                icon={<CanvaIcon />}
                                bgColor="hover:bg-cyan-500/10"
                                delay={400}
                            />
                            <PlatformCard
                                platform="Adobe Community"
                                analysis={(result as DynamicPromptResult).platformAnalyses?.adobe}
                                icon={<AdobeIcon />}
                                bgColor="hover:bg-red-500/10"
                                delay={450}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                            <PlatformCard
                                platform="Unsplash"
                                analysis={(result as DynamicPromptResult).platformAnalyses?.unsplash}
                                icon={<UnsplashIcon />}
                                bgColor="hover:bg-slate-500/10"
                                delay={100}
                            />
                            <PlatformCard
                                platform="Etsy"
                                analysis={(result as DynamicPromptResult).platformAnalyses?.etsy}
                                icon={<EtsyIcon />}
                                bgColor="hover:bg-orange-500/10"
                                delay={150}
                            />
                            <PlatformCard
                                platform="Amazon Seller Central"
                                analysis={(result as DynamicPromptResult).platformAnalyses?.amazon}
                                icon={<AmazonIcon />}
                                bgColor="hover:bg-yellow-500/10"
                                delay={200}
                            />
                            <PlatformCard
                                platform="Shopify Community"
                                analysis={(result as DynamicPromptResult).platformAnalyses?.shopify}
                                icon={<ShopifyIcon />}
                                bgColor="hover:bg-green-500/10"
                                delay={250}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                            <PlatformCard
                                platform="WooCommerce"
                                analysis={(result as DynamicPromptResult).platformAnalyses?.woocommerce}
                                icon={<WooCommerceIcon />}
                                bgColor="hover:bg-fuchsia-500/10"
                                delay={300}
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
                    <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/10 max-w-4xl mx-auto mb-8">
                        <div className="text-center mb-6">
                            <h3 className="text-xl font-bold text-white mb-2">Test Your Idea</h3>
                            <p className="text-slate-300">Copy and use these AI-generated posts to validate your idea on social platforms</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Twitter Suggestion */}
                    <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-600/30">
                                            <XIcon />
                                        </div>
                                        <span className="font-semibold text-slate-100">X (Twitter)</span>
                                    </div>
                                    <button
                                        onClick={() => handleCopyToClipboard(result.tweetSuggestion, 'tweet')}
                                        className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-lg shadow-blue-600/30"
                                    >
                                        {copiedId === 'tweet' ? '✓ Copied!' : 'Copy'}
                                    </button>
                                </div>
                                <div className="text-sm text-slate-200 leading-relaxed bg-white/5 backdrop-blur-xl rounded-lg p-4 border border-white/10">
                                    {result.tweetSuggestion}
                                </div>
                                <div className="mt-3 text-xs text-blue-300 font-medium">
                                    💡 Best for: Quick validation & viral potential
                                </div>
                            </div>

                            {/* Reddit Suggestion */}
                            <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center shadow-lg shadow-orange-600/30">
                                            <RedditIcon />
                                        </div>
                                        <span className="font-semibold text-slate-100">Reddit</span>
                                    </div>
                                    <button
                                        onClick={() => handleCopyToClipboard(`${result.redditTitleSuggestion}\n\n${result.redditBodySuggestion}`, 'reddit')}
                                        className="text-xs bg-orange-600 text-white px-3 py-1.5 rounded-lg hover:bg-orange-700 transition-colors font-medium shadow-lg shadow-orange-600/30"
                                    >
                                        {copiedId === 'reddit' ? '✓ Copied!' : 'Copy'}
                                    </button>
                                </div>
                                <div className="bg-white/5 backdrop-blur-xl rounded-lg p-4 border border-white/10">
                                    <div className="text-sm font-semibold text-slate-100 mb-2">
                                        {result.redditTitleSuggestion}
                                    </div>
                                    <div className="text-sm text-slate-200 leading-relaxed">
                                        {result.redditBodySuggestion}
                                    </div>
                                </div>
                                <div className="mt-3 text-xs text-orange-300 font-medium">
                                    💡 Best for: Detailed feedback & community insights
                                </div>
                            </div>

                            {/* LinkedIn Suggestion */}
                            <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-600/30">
                                            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                            </svg>
                                        </div>
                                        <span className="font-semibold text-slate-100">LinkedIn</span>
                                    </div>
                                    <button
                                        onClick={() => handleCopyToClipboard(result.linkedinSuggestion, 'linkedin')}
                                        className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-lg shadow-indigo-600/30"
                                    >
                                        {copiedId === 'linkedin' ? '✓ Copied!' : 'Copy'}
                                    </button>
                                </div>
                                <div className="text-sm text-slate-200 leading-relaxed bg-white/5 backdrop-blur-xl rounded-lg p-4 border border-white/10">
                                    {result.linkedinSuggestion}
                                </div>
                                <div className="mt-3 text-xs text-indigo-300 font-medium">
                                    💡 Best for: Professional validation & B2B feedback
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 p-4 bg-white/5 backdrop-blur-xl rounded-lg border border-white/10">
                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-blue-300 text-sm">💡</span>
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold text-white mb-1">Quick Validation Tips</h4>
                                    <p className="text-xs text-slate-300 leading-relaxed">
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
                        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 text-white shadow-2xl border border-white/10 max-w-2xl mx-auto">
                            <h3 className="text-2xl font-bold mb-4">Ready to Build Your Idea?</h3>
                            <p className="text-slate-200 mb-6 text-lg">
                                {status.desc} {status.action}.
                            </p>
                            <button
                                onClick={() => navigate('/')}
                                className="bg-white text-slate-900 px-8 py-4 rounded-xl font-semibold hover:bg-slate-100 transition-all duration-300 shadow-lg"
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

// Phase 3 Platform Icons - Professional & Business
const SlackIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"/>
    </svg>
);

const ClubhouseIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.568 14.29c-.12.64-.37 1.23-.74 1.76-.37.53-.85.98-1.42 1.33-.57.35-1.21.59-1.89.71-.68.12-1.39.12-2.07 0-.68-.12-1.32-.36-1.89-.71-.57-.35-1.05-.8-1.42-1.33-.37-.53-.62-1.12-.74-1.76-.12-.64-.1-1.31.06-1.94.16-.63.45-1.21.85-1.71.4-.5.91-.9 1.48-1.18.57-.28 1.2-.44 1.84-.47.64-.03 1.28.08 1.88.32.6.24 1.14.6 1.58 1.06.44.46.77 1.01.97 1.61.2.6.27 1.24.21 1.87-.06.63-.25 1.24-.56 1.79z"/>
    </svg>
);

const SubstackIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z"/>
    </svg>
);

const NotionIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466l1.823 1.447zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.139c-.093-.514.28-.887.747-.933l3.269-.186z"/>
    </svg>
);

// Phase 3 Platform Icons - Developer & Tech
const DevToIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M7.42 10.05c-.18-.16-.46-.23-.84-.23H6.1v4.36h.48c.38 0 .66-.07.84-.23.18-.16.27-.42.27-.78v-2.34c0-.36-.09-.62-.27-.78zm16.44-2.5c-.04-.4-.2-.78-.44-1.1-.24-.32-.56-.58-.94-.78-.38-.2-.8-.3-1.26-.3H2.94c-.46 0-.88.1-1.26.3-.38.2-.7.46-.94.78-.24.32-.4.7-.44 1.1L0 12l.3 4.45c.04.4.2.78.44 1.1.24.32.56.58.94.78.38.2.8.3 1.26.3h18.28c.46 0 .88-.1 1.26-.3.38-.2.7-.46.94-.78.24-.32.4-.7.44-1.1L24 12l-.3-4.45zM8.56 15.3c-.44.58-1.06.87-1.86.87H4.5V8.83h2.2c.8 0 1.42.29 1.86.87.44.58.66 1.32.66 2.22v.36c0 .9-.22 1.64-.66 2.22zm7.74-4.02l-1.4 4.9h-1.18l-.95-3.18-.95 3.18h-1.18l-1.4-4.9h1.1l.9 3.28.95-3.28h1.06l.95 3.28.9-3.28h1.1zm4.16 2.22c0 .9-.22 1.64-.66 2.22-.44.58-1.06.87-1.86.87h-2.2V8.83h2.2c.8 0 1.42.29 1.86.87.44.58.66 1.32.66 2.22v.36z"/>
    </svg>
);

const HashnodeIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22.351 8.019l-6.37-6.37a5.63 5.63 0 0 0-7.962 0l-6.37 6.37a5.63 5.63 0 0 0 0 7.962l6.37 6.37a5.63 5.63 0 0 0 7.962 0l6.37-6.37a5.63 5.63 0 0 0 0-7.962zM12 15.953a3.953 3.953 0 1 1 0-7.906 3.953 3.953 0 0 1 0 7.906z"/>
    </svg>
);

const GitLabIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.955 13.587l-1.342-4.135-2.664-8.189c-.135-.423-.73-.423-.867 0L16.418 9.45H7.582L4.919 1.263c-.135-.423-.73-.423-.867 0L1.388 9.452.045 13.587a.849.849 0 0 0 .308.95l11.647 8.463 11.647-8.463a.849.849 0 0 0 .308-.95z"/>
    </svg>
);

const CodePenIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 8.182l-.018-.087-.017-.05c-.01-.024-.018-.05-.03-.075-.003-.018-.015-.034-.02-.05l-.035-.067-.03-.05-.044-.06-.046-.045-.06-.045-.046-.03-.06-.044-.044-.04-.015-.02L12.58.19c-.347-.232-.796-.232-1.142 0L.453 7.502l-.015.015-.044.035-.06.05-.038.04-.05.056-.037.045-.05.06c-.02.017-.03.03-.03.046l-.05.06-.02.06c-.02.01-.02.04-.03.07l-.01.05C0 8.12 0 8.15 0 8.18v7.497c0 .044.003.09.01.135l.01.046c.005.03.01.06.02.086l.015.05c.01.027.016.053.027.075l.022.05c0 .01.015.04.03.06l.03.04c.015.01.03.04.045.06l.03.04.04.04c.01.013.01.03.03.03l.06.042.04.03.01.014 10.97 7.33c.164.12.375.163.57.163s.39-.06.57-.18l10.99-7.28.014-.01.046-.037.06-.043.048-.036.052-.058.033-.045.04-.06.03-.05.03-.07.016-.052.03-.077.015-.045.03-.08v-7.5c0-.05 0-.095-.016-.14l-.014-.045.044.003zm-11.99 6.28l-3.65-2.44 3.65-2.442 3.65 2.44-3.65 2.44zm-1.034-6.674l-4.473 2.99L2.89 8.362l8.086-5.39V14.3zm-6.33 4.233l-2.582 1.73V10.3l2.582 1.726zm1.857 1.25l4.473 2.99v1.426L2.89 15.69l3.618-2.417v-.004zm6.537 2.99l4.474-2.98 3.618 2.414-8.092 5.39v-4.82zm6.33-4.23l2.583-1.72v3.456l-2.583-1.73zm-1.855-1.24L13.042 7.8V6.347l8.086 5.39-3.612 2.415v.003z"/>
    </svg>
);

const IndieHackersIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M0 0v24h24V0H0zm13.5 22.5h-3v-9h3v9zm0-10.5h-3v-1.5c0-2.485 2.015-4.5 4.5-4.5s4.5 2.015 4.5 4.5V12h-3v-1.5c0-.825-.675-1.5-1.5-1.5s-1.5.675-1.5 1.5V12z"/>
    </svg>
);

// Phase 3 Platform Icons - Creative & Design
const AwwwardsIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0L9.798 8.5H1l7.1 5.15L5.9 22 12 16.85 18.1 22l-2.2-8.35L23 8.5h-8.798L12 0z"/>
    </svg>
);

const Designs99Icon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.568 17.568c-.88.88-2.04 1.32-3.2 1.32s-2.32-.44-3.2-1.32c-.88-.88-1.32-2.04-1.32-3.2s.44-2.32 1.32-3.2c.88-.88 2.04-1.32 3.2-1.32s2.32.44 3.2 1.32c.88.88 1.32 2.04 1.32 3.2s-.44 2.32-1.32 3.2z"/>
    </svg>
);

const CanvaIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.568 17.568c-.88.88-2.04 1.32-3.2 1.32s-2.32-.44-3.2-1.32c-.88-.88-1.32-2.04-1.32-3.2s.44-2.32 1.32-3.2c.88-.88 2.04-1.32 3.2-1.32s2.32.44 3.2 1.32c.88.88 1.32 2.04 1.32 3.2s-.44 2.32-1.32 3.2z"/>
    </svg>
);

const AdobeIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M13.966 22.624l-1.69-4.281H8.122l3.892-9.144 5.662 13.425zM8.884 1.376H0v21.248zm15.116 0h-8.884L24 22.624z"/>
    </svg>
);

const UnsplashIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M7.5 6.75V0h9v6.75h-9zm9 3.75H24V24H0V10.5h7.5v6.75h9V10.5z"/>
    </svg>
);

// Phase 3 Platform Icons - E-commerce & Retail
const EtsyIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M9.16 12.24c0-1.12.96-2.04 2.08-2.04 1.12 0 2.08.92 2.08 2.04 0 1.12-.96 2.04-2.08 2.04-1.12 0-2.08-.92-2.08-2.04zM24 12c0 6.64-5.36 12-12 12S0 18.64 0 12 5.36 0 12 0s12 5.36 12 12zM6.4 8.8h11.2c.88 0 1.6.72 1.6 1.6v3.2c0 .88-.72 1.6-1.6 1.6H6.4c-.88 0-1.6-.72-1.6-1.6v-3.2c0-.88.72-1.6 1.6-1.6z"/>
    </svg>
);

const AmazonIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M.045 18.02c.072-.116.187-.124.348-.022 3.636 2.11 7.594 3.166 11.87 3.166 2.852 0 5.668-.533 8.447-1.595l.315-.14c.138-.06.234-.1.293-.13.226-.088.39-.046.525.13.12.174.09.336-.12.48-.256.19-.6.41-1.006.654-1.244.743-2.64 1.316-4.185 1.726-1.548.41-3.156.615-4.83.615-3.264 0-6.32-.665-9.15-1.99-.232-.109-.293-.203-.293-.335 0-.13.046-.22.138-.31.092-.09.18-.135.27-.135.09 0 .18.045.27.135l.138.155zm23.696-4.802c-.052.148-.14.22-.27.22-.13 0-.27-.072-.42-.22l-4.392-4.392c-.15-.15-.225-.3-.225-.45s.075-.3.225-.45l4.392-4.392c.15-.15.29-.225.42-.225.13 0 .218.075.27.225.052.15.052.3 0 .45L19.35 8.376c-.15.15-.225.3-.225.45s.075.3.225.45l4.392 4.392c.052.15.052.3 0 .45z"/>
    </svg>
);

const ShopifyIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M15.337 2.136c-.38-.054-.87.054-1.4.324-.054-.162-.162-.378-.324-.54-.54-.54-1.35-.756-2.133-.54-2.457.648-3.618 3.024-4.05 4.59-.324.972-.594 1.782-.81 2.376-.648.216-1.134.378-1.188.405-1.026.324-1.08.378-1.188 1.35C4.136 10.425 2 21.735 2 21.735l13.716 2.43 6.282-1.35s-6.39-19.494-6.66-20.68zm-2.7 1.89c-.27.081-.594.189-.972.324v-.27c0-.648-.108-1.188-.27-1.566.54-.162 1.026-.054 1.242.486.108.378.108.756 0 1.026zm-1.89.648c-.756.243-1.62.513-2.484.783.432-1.674 1.242-2.484 2.052-2.808.162.378.27.864.27 1.458v.567zm-.81-2.43c-.27 0-.54.054-.756.162-.648.378-1.35 1.242-1.782 2.97-.378.108-.756.243-1.08.324.432-1.458 1.35-2.916 2.7-3.456.324-.162.648-.216.918-.216z"/>
    </svg>
);

const WooCommerceIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.527 8.257c-.105-1.25-1.893-1.28-2.036-.03l-.534 4.632c-.534-1.636-1.25-4.098-1.25-4.098-.356-1.071-1.785-.89-1.785.18 0 0 .534 2.767 1.07 5.18-.89 2.5-2.41 4.276-4.1 4.276-1.607 0-2.41-1.25-2.41-3.21 0-3.21 1.607-7.5 3.57-7.5.714 0 1.25.357 1.25 1.072 0 .535-.357 1.07-.892 1.07-.357 0-.714-.356-.714-.713 0-.178.089-.356.267-.445-.178-.089-.445-.133-.713-.133-1.25 0-2.41 1.607-2.41 4.01 0 1.608.713 2.59 1.785 2.59.892 0 1.785-.892 2.41-2.232L15.67 8.79c.178-1.25 1.964-1.25 2.036 0l.356 3.21c.535-1.07 1.07-2.41 1.07-2.41.356-1.072 1.785-.892 1.785.178 0 0-.535 1.607-1.07 3.21.535 1.25 1.25 2.05 2.05 2.05.535 0 .892-.356.892-.892 0-.535-.357-.892-.892-.892-.178 0-.356.089-.445.178.089-.178.133-.356.133-.535 0-.713-.535-1.25-1.25-1.25-1.25 0-2.41 1.25-3.21 3.21-.535 1.25-1.25 2.05-2.05 2.05-.892 0-1.607-.713-2.05-1.785L9.375 8.79c-.178-1.25-1.964-1.25-2.036 0L6.875 12c-.535-1.07-1.07-2.41-1.07-2.41-.356-1.072-1.785-.892-1.785.178 0 0 .535 1.607 1.07 3.21C4.555 14.23 3.84 15.03 3.04 15.03c-.535 0-.892-.356-.892-.892 0-.535.357-.892.892-.892.178 0 .356.089.445.178-.089-.178-.133-.356-.133-.535 0-.713.535-1.25 1.25-1.25 1.25 0 2.41 1.25 3.21 3.21.535 1.25 1.25 2.05 2.05 2.05.892 0 1.607-.713 2.05-1.785l.534-4.632c.534 1.636 1.25 4.098 1.25 4.098.356 1.071 1.785.89 1.785-.18 0 0-.534-2.767-1.07-5.18.89-2.5 2.41-4.276 4.1-4.276 1.607 0 2.41 1.25 2.41 3.21 0 3.21-1.607 7.5-3.57 7.5-.714 0-1.25-.357-1.25-1.072 0-.535.357-1.07.892-1.07.357 0 .714.356.714.713 0 .178-.089.356-.267.445.178.089.445.133.713.133 1.25 0 2.41-1.607 2.41-4.01 0-1.608-.713-2.59-1.785-2.59-.892 0-1.785.892-2.41 2.232l-.356-3.21z"/>
    </svg>
);