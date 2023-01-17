import { render, screen, cleanup } from "@testing-library/react";
import { describe, it, expect, beforeAll } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

import PostListItem from './PostListItem';

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
    }
];

describe('PostListItem render', () => {
    it('expects TypeError: postData is not an object', async () => {
        await expect(async () => render(<PostListItem />)).rejects.toThrow("postData is not an object")
    });

    it('should render', () => {
        render(<PostListItem postData={postList[0]} />, { wrapper: MemoryRouter });
    });

    describe('PostListItem children', () => {
        // beforeAll(() => {
        //     cleanup();
        //     render(<PostListItem postData={postList[0]} />, { wrapper: MemoryRouter });
        // });
    
        it("should render title", () => {
            screen.getByText('Post One')
        })
    
        it("should render updated date", () => {
            screen.getByText(postList[0].updated)
        })
    
        it('should have Visit link', () => {
            expect(screen.getByText('Visit').closest('a').href).toMatch(postList[0].slug)
        })

        it('should have Edit link', () => {
            expect(screen.getByText('Edit').closest('a').href).toMatch(postList[0].slug + '/edit')
        })
    });
});

