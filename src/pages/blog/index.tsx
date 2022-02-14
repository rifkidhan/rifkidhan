import type { ReactElement } from "react";
import type { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import { PostCard, CategoryButton } from "@/components/blog";
import { Breadcrumb } from "@/components/display";
import Layout from "@/components/Layout";
import {
	getBlogPostIndex,
	getBlogCategory,
	getBlogPostsIndex,
	getCategoryBlog,
} from "@/libs/data/queries";
import useSWR, { SWRConfig } from "swr";
import { fetcher } from "@/libs/api";
import { useState } from "react";
import { NextSeo } from "next-seo";

const Blogs = ({}) => {
	const [category, setCategory] = useState<string>("All");

	const variables = { category: `${category}` };

	const { data: blog } = useSWR([getBlogPostIndex, variables], fetcher);
	const { data: blog_category } = useSWR(getBlogCategory, fetcher);

	return (
		<div className="flex flex-col gap-10">
			<NextSeo title="Blogs" />
			<Breadcrumb title={"Blogs"} />
			<div className="isContainer">
				<div className="flex gap-5 items-center justify-center overflow-auto snap-x touch-pan-x">
					{blog_category?.blog_category.map((category: any) => (
						<div key={category.id} className="snap-center">
							<CategoryButton
								onClick={() => setCategory(`${category.title}`)}
								title={category.title}
							/>
						</div>
					))}
				</div>
			</div>
			<div className="isContainer">
				<h3 className="text-center">{category} Blogs</h3>
			</div>
			<div className="isContainer">
				<div className="postcard_index my-10 mx-auto px-5">
					{blog?.blog.map((blog: any) => (
						<div key={blog.id}>
							<PostCard
								title={blog.title}
								slug={blog.slug}
								image={blog.feature_image.id}
								content={blog.content}
							/>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export async function getStaticProps({}: GetStaticPropsContext) {
	const posts = await getBlogPostsIndex();
	const categories = await getCategoryBlog();

	return {
		props: {
			fallback: {
				getBlogPostIndex: posts,
				getBlogCategory: categories,
			},
		},
		revalidate: 60 * 60,
	};
}

const IndexBlog = ({
	fallback,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
	return (
		<SWRConfig value={{ fallback }}>
			<Blogs />
		</SWRConfig>
	);
};

export default IndexBlog;

IndexBlog.getLayout = function getLayout(page: ReactElement) {
	return <Layout>{page}</Layout>;
};