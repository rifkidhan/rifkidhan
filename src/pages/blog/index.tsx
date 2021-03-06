import type { GetStaticProps, InferGetStaticPropsType } from 'next';
import { PostCard, CategoryButton } from '@components/page/blog';
import { Layout, Breadcrumb, SEO } from '@components/common';
import useSWR, { SWRConfig } from 'swr';
import { useState } from 'react';
import { fetcher } from '@libs/directus';

const blogsWithoutFilter = `blog?fields=id,title,slug,feature_image,excerpt`;
const blogCategory = `blog_category?fields=id,title`;

export const getStaticProps: GetStaticProps = async () => {
  const posts = await fetcher(blogsWithoutFilter);
  const categories = await fetcher(blogCategory);

  return {
    props: {
      fallback: {
        [blogsWithoutFilter]: posts,
        [blogCategory]: categories
      }
    },
    revalidate: 60
  };
};

const Blogs = ({}) => {
  const [category, setCategory] = useState<string>('All');

  const blogsWithFilter = `blog?filter[category][blog_category_id][title][_eq]=${category}&fields=id,title,slug,feature_image,excerpt`;

  const { data: blog } = useSWR(
    category !== 'All' ? blogsWithFilter : blogsWithoutFilter,
    fetcher
  );
  const { data: blog_category } = useSWR(blogCategory, fetcher);

  return (
    <div className="page-wrapper">
      <SEO
        title="Blog"
        description="Rifki Ramadhan's Blog"
        openGraph={{
          title: 'Blog',
          description: "Rifki Ramadhan's Blog"
        }}
      />
      <Breadcrumb title={'Blogs'} />
      <section className="blog_index isContainer">
        <div className="category_button_wrapper no-scrollBar">
          <CategoryButton onClick={() => setCategory('All')} title="All" />
          {blog_category?.data.map((category: any) => (
            <div key={category.id}>
              <CategoryButton
                onClick={() => setCategory(`${category.title}`)}
                title={category.title}
              />
            </div>
          ))}
        </div>
        <h3 className="text-center">{category} Blogs</h3>
        <div className="postCard_index">
          {blog?.data.map((blog: any) => (
            <div key={blog.id}>
              <PostCard
                title={blog.title}
                slug={blog.slug}
                image={blog.feature_image}
                content={blog.excerpt}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

const IndexBlog = ({
  fallback
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <SWRConfig value={{ fallback }}>
      <Blogs />
    </SWRConfig>
  );
};

export default IndexBlog;

IndexBlog.Layout = Layout;
