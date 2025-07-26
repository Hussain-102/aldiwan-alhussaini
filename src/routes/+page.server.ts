// + page.server.ts
export async function load() {
    // Return empty data instantly without calling the database
    return {
        poems: [],
        currentPage: 1,
        totalPages: 1
    };
}