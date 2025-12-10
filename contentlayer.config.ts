import { defineDocumentType, makeSource } from "contentlayer2/source-files";

export const Product = defineDocumentType(() => ({
  name: "Product",
  filePathPattern: `**/*.mdx`,
  contentType: "mdx",
  fields: {
    title: {
      type: "string",
      required: true,
      description: "Product title",
    },
    slug: {
      type: "string",
      required: true,
      description: "URL-friendly slug",
    },
    description: {
      type: "string",
      description: "Product description for SEO",
    },
    category: {
      type: "string",
      required: true,
      description: "Product category",
    },
    featured: {
      type: "boolean",
      default: false,
      description: "Featured on homepage",
    },
  },
  computedFields: {
    url: {
      type: "string",
      resolve: (doc) => `/products/${doc.slug}`,
    },
  },
}));

export default makeSource({
  contentDirPath: "src/content",
  documentTypes: [Product],
});
