import Filter from "@/components/Filter/Filter";
import Footer from "@/components/Footer";
import Header from "@/components/Header/Header";
import PosterList from "@/components/PosterList";
import { IPosterGet, IPosterFilters } from "@/interfaces/poster.interfaces";
import api from "@/services/api";
import { Box, Container, Flex, Heading, Text, useToast } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import bgImage from "../assets/bgHome.png";
import Pagination from "@/components/Pagination";
import { GetServerSideProps, NextPage } from "next";
import { ParsedUrlQuery } from "querystring";

interface IHomeProps {
  query: ParsedUrlQuery;
}
const Home: NextPage<IHomeProps> = ({ query }) => {
  const [posterList, setPosterList] = useState<IPosterGet[]>([]);
  const [filters, setFilters] = useState<IPosterFilters>([] as any);
  const [homeLoading, setHomeLoading] = useState<boolean>(true);
  const [count, setCount] = useState<number>(0);
  const toast = useToast();

  useEffect(() => {
    const getPostersAndFilters = async () => {
      setHomeLoading(true);

      try {
        const [posters, filters] = await Promise.all([
          api.get(`/posters`, {
            timeout: 20000,
            params: {
              ...query,
              perPage: 12,
              published: 1,
            },
          }),
          api.get(`/posters/filters`, {
            timeout: 20000,
            params: {
              ...query,
              published: 1,
            },
          }),
        ]);
        setPosterList(posters.data.data);
        setFilters(filters.data);
        setCount(posters.data.count);
      } catch (error: any) {
        console.error(error);
        if (!toast.isActive("ServerExp")) {
          toast({
            status: "error",
            title:
              error.code == "ECONNABORTED"
                ? "O servidor demorou muito para responder"
                : "Ops, ocorreu um erro",
            description: "Recarregue a página ou tente novamente mais tarde",
            duration: 5000,
            position: "bottom-right",
            containerStyle: {
              color: "white",
            },
            isClosable: true,
            id: "ServerExp",
          });
        }
        setPosterList([]);
        setFilters([] as any);
      }
      setHomeLoading(false);
    };

    getPostersAndFilters();
  }, [, query]);

  return (
    <>
      <Header />
      <Box h={"80px"} />
      <Flex
        w={"100%"}
        height={"50vh"}
        color={"grey.10"}
        bg={`url(${bgImage.src}) no-repeat center`}
        position={"relative"}
        bgSize={"cover"}
      >
        <Flex
          justify={"center"}
          align={"center"}
          position={"absolute"}
          h={"100%"}
          w={"100%"}
          bgGradient={"linear(to-b,  blackAlpha.500, black 95%, black 100%)"}
          zIndex={"1"}
          bottom={0}
        >
          <Flex
            gap={{ base: "30px", md: "0" }}
            direction={"column"}
            textAlign={"center"}
            transform={{ base: "translateY(-80px)", md: "translateY(0px)" }}
            w={"90%"}
          >
            <Heading
              fontSize={{ base: "heading.3", md: "heading.1" }}
              fontWeight={{ base: "medium", md: "bold" }}
              as={"h2"}
            >
              Motors Shop{" "}
            </Heading>
            <Heading
              fontSize={{ base: "heading.5", md: "heading.2" }}
              fontWeight={{ base: "medium", md: "semibold" }}
              as={"h2"}
            >
              A melhor plataforma de anúncios de carros do país
            </Heading>
          </Flex>
        </Flex>
      </Flex>
      <Container p={0} maxWidth={"1600px"}>
        <Flex
          gap={{ base: "80px", lg: "30px" }}
          direction={{ base: "column", lg: "row-reverse" }}
          justify={{ base: "none", md: "space-between" }}
          p={{ base: "70px 0px 70px 0px", lg: "60px 63px 60px 30px" }}
        >
          <PosterList
            maxWidth="1000px"
            width={{ lg: "70%", xl: "80%" }}
            columns={{ lg: 2, xl: 3 }}
            maxColumns={3}
            posterList={posterList}
            showPromoTag={true}
            showStatusTag={false}
            showSeller={true}
            isLoading={homeLoading}
          />
          <Filter filters={filters!} query={query} />
        </Flex>
        <Pagination
          count={count}
          page={Number(parseInt(query?.page! as string)) || 1}
          query={query}
        />
      </Container>
      <Footer />
    </>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return {
    props: {
      query: ctx.query,
    },
  };
};
