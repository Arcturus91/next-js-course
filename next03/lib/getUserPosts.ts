export default async function getUserPosts(userId: string) {
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/posts?userId=${userId}`,
    {
      /*  cache: "force-cache",  this is the default setting.
     if data is changing, you d prefer to use the following code: */
      //cache:'no-store' this is another option.
      next: { revalidate: 60 }, //this means it will show the cached data for 60 seconds, then it will fetch the new data. However it is not magically changing it in front of your eyes. you need to re enter the page to see the new data.
    }
  );

  if (!res.ok) return undefined;

  return res.json();
}

//ISR : Incremental Static Regeneration.
//Next.js allows you to create or update static pages after you’ve built your site. Incremental Static Regeneration (ISR) enables you to use static-generation on a per-page basis, without needing to rebuild the entire site. With ISR, you can retain the benefits of static while scaling to millions of pages
//ssg (static side generation)is the recommended way to fetch data for next.js. why? because it is faster than client side rendering. and it is more secure than server side rendering.
