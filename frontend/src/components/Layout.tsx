import Header from "@/components/Header";
import { ReactElement } from "react";
import Head from "next/head";

type LayoutProps = {
  children: ReactElement;
};
export default function Layout({ children, ...props }: LayoutProps) {
  return (
    <>
      <Head>
        <meta
          name="description"
          content="A simple SNS application deployed by Google Cloud Run"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Header />
      <div {...props}>{children}</div>
    </>
  );
}
