import { render, screen, cleanup, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

import PostList from "./PostList";
import { post_api_url } from './settings'


// ['id', 'title', 'body', 'slug', 'updated', 'created', 'author']
const date1 = (new Date(2002, 6, 3, 10, 10, 10)).toLocaleDateString();
const postList = [
    {
        id: 1,
        title: 'Post One',
        body: 'post body 1',
        slug: 'post1',
        updated: date1,
        created: date1,
        author: 0
    },
    {
        id: 2,
        title: 'Post two',
        body: 'post body 2',
        slug: 'post2',
        updated: date1,
        created: date1,
        author: 0
    }
];

const myMockFetch = (url) => {
    let response;
    switch (url) {
        case post_api_url:
            response = postList
            break
        default:
            response = { error: 'Invalid url', ok: false }
            break
    }
    return Promise.resolve({
        json: () => Promise.resolve(response)
    })
}

describe('PostList', () => {
    beforeAll(() => {
        global.fetch = vi.spyOn(global, 'fetch').mockImplementation(myMockFetch)
    })

    afterAll(() => {
        vi.restoreAllMocks();
        cleanup()
    })

    it('should render', () => {
        render(<PostList />, { wrapper: MemoryRouter });
    })

    describe('test element after did mount', () => {
        it('should have rendered PostListItems as well', async () => {
            await waitFor(() => {
                screen.getByText(postList[0].title)
                screen.getByText(postList[1].title)
            })
        })
    })
})

describe('Test PostList if fetch fail', () => {
    beforeAll(() => {
        global.fetch = vi.spyOn(global, 'fetch').mockImplementation(() => (
            Promise.resolve({
                json: () => Promise.resolve({ error: 'Invalid url', ok: false })
            })
        ))
        render(<PostList />, { wrapper: MemoryRouter });
    })

    afterAll(() => {
        vi.restoreAllMocks();
    })

    it("should return 'No posts'", async () => {
        await waitFor(() => {
            screen.getByText('No posts')
        })
    })
})