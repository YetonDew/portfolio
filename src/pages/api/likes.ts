export const prerender = false;

import type { APIRoute } from 'astro';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const STORE_PATH = '/tmp/portfolio_likes.json';

function readStore(): { count: number } {
	try {
		if (existsSync(STORE_PATH)) {
			return JSON.parse(readFileSync(STORE_PATH, 'utf-8'));
		}
	} catch { /* ignore */ }
	return { count: 0 };
}

function writeStore(data: { count: number }) {
	try {
		writeFileSync(STORE_PATH, JSON.stringify(data), 'utf-8');
	} catch { /* ignore */ }
}

export const GET: APIRoute = () => {
	const { count } = readStore();
	return new Response(JSON.stringify({ count }), {
		headers: { 'Content-Type': 'application/json' },
	});
};

export const DELETE: APIRoute = ({ request }: { request: Request }) => {
	const cookie = request.headers.get('cookie') ?? '';
	const hasLiked = cookie.includes('portfolio_liked=1');

	if (!hasLiked) {
		const { count } = readStore();
		return new Response(JSON.stringify({ count }), {
			headers: { 'Content-Type': 'application/json' },
		});
	}

	const store = readStore();
	store.count = Math.max(0, store.count - 1);
	writeStore(store);

	return new Response(JSON.stringify({ count: store.count }), {
		headers: {
			'Content-Type': 'application/json',
			'Set-Cookie': 'portfolio_liked=; Max-Age=0; Path=/; SameSite=Lax',
		},
	});
};

export const POST: APIRoute = ({ request }: { request: Request }) => {
	const cookie = request.headers.get('cookie') ?? '';
	const alreadyLiked = cookie.includes('portfolio_liked=1');

	if (alreadyLiked) {
		const { count } = readStore();
		return new Response(JSON.stringify({ count, alreadyLiked: true }), {
			headers: { 'Content-Type': 'application/json' },
		});
	}

	const store = readStore();
	store.count += 1;
	writeStore(store);

	return new Response(JSON.stringify({ count: store.count }), {
		headers: {
			'Content-Type': 'application/json',
			'Set-Cookie': 'portfolio_liked=1; Max-Age=31536000; Path=/; SameSite=Lax',
		},
	});
};
