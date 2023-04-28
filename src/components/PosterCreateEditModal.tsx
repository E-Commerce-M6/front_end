import {
  Modal,
  ModalOverlay,
  ModalContent,
  Flex,
  Heading,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  InputGroup,
  InputRightElement,
  IconButton,
  FormErrorMessage,
  Button,
  Text,
  Box,
  List,
  ListItem,
  InputLeftAddon,
} from "@chakra-ui/react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FiTrash } from "react-icons/fi";
import React, { useEffect, useState } from "react";
import { brlCurrencyMask } from "@/functions/masks";
import { TCreatePoster } from "@/interfaces/poster.interfaces";
import { createPostSchema } from "@/schemas";
import { posterContext } from "@/contexts/PosterContext";

interface IPosterCreateEditModal {
  isOpen: boolean;
  onClose: () => void;
  onSucessModalOpen: () => void;
}

interface iCar {
  id: string;
  name: string;
  brand: string;
  year: string;
  fuel: number;
  value: number;
}

const PosterCreateEditModal = ({ isOpen, onClose, onSucessModalOpen }: IPosterCreateEditModal) => {
  const [brandSearch, setBrandSearch] = useState<string>("");
  const [brandArray, setBrandArray] = useState<string[]>([]);
  const [brandFilterArray, setBrandFilterArray] = useState<string[]>([]);

  const [modelSearch, setModelSearch] = useState("");
  const [modelArray, setModelArray] = useState<string[]>([]);
  const [modelFilterArray, setModelFilterArray] = useState<string[]>([]);

  const [carArray, setCarArray] = useState<iCar[]>([]);
  const [carBrandModel, setCarBrandModel] = useState("");

  const { posterCreate } = posterContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<TCreatePoster>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      images: [{ url: "" }, { url: "" }, { url: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "images",
  });

  useEffect(() => {
    const getAllCars = async () => {
      try {
        const response = await fetch("https://kenzie-kars.herokuapp.com/cars/");
        const data = await response.json();

        setBrandArray(Object.keys(data));
      } catch (error: any) {
        console.log(error.data.message);
      }
    };
    getAllCars();
  }, []);

  useEffect(() => {
    const getCarModel = async () => {
      if (
        carBrandModel &&
        brandSearch &&
        !brandFilterArray.length &&
        brandArray.includes(brandSearch) &&
        brandSearch !== carBrandModel
      ) {
        setModelSearch("");
        reset({
          year: "",
          fuel_type: "",
          fipe_price: "",
        });
      }

      if (brandSearch && !brandFilterArray.length && brandArray.includes(brandSearch)) {
        try {
          const response = await fetch(
            `https://kenzie-kars.herokuapp.com/cars?brand=${brandSearch}`
          );
          const data: iCar[] = await response.json();

          setCarArray(data);
          setModelArray(
            data.map((car, index) => {
              if (index == 0) {
                setCarBrandModel(car.brand);
              }
              return car.name;
            })
          );

          if (!data.length) {
            setBrandSearch("");
            reset({
              brand: "",
            });
          }
        } catch (error: any) {
          console.log(error.data.message);
        }
      } else if (
        !brandSearch ||
        (brandSearch && !brandFilterArray.length && !brandArray.includes(brandSearch))
      ) {
        setBrandSearch("");
        reset({
          brand: "",
        });
        setModelSearch("");
        reset({
          year: "",
          fuel_type: "",
          fipe_price: "",
        });
      }
    };

    getCarModel();
  }, [brandSearch]);

  useEffect(() => {
    const getCarData = () => {
      if (modelSearch && !modelFilterArray.length && modelArray.includes(modelSearch)) {
        const car = carArray.find((car) => car.name == modelSearch);
        const fuelType = ["flex", "híbrido", "elétrico"];

        reset({
          year: car!.year,
          fuel_type: fuelType[car!.fuel - 1],
          fipe_price: car!.value
            .toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
              maximumFractionDigits: 2,
            })
            .split(/\s/g)[1],
        });
      } else if (modelSearch && !modelFilterArray.length && !modelArray.includes(modelSearch)) {
        setModelSearch("");
        reset({
          year: "",
          fuel_type: "",
          fipe_price: "",
        });
      }
    };

    getCarData();
  }, [modelSearch]);

  const handleBrandSearch = (value: string) => {
    setBrandSearch(value);
    if (value) {
      setBrandFilterArray(brandArray.filter((brand) => brand.includes(value.toLowerCase())));
    } else {
      setBrandFilterArray([]);
    }
  };

  const handleModelSearch = (value: string) => {
    setModelSearch(value);
    if (value) {
      setModelFilterArray(modelArray.filter((model) => model.includes(value.toLowerCase())));
    } else {
      setModelFilterArray([]);
    }
  };

  const closeAndReset = () => {
    onClose();
    setBrandSearch("");
    reset({
      brand: "",
      color: "",
      description: "",
      fipe_price: "",
      fuel_type: "",
      kilometers: "",
      model: "",
      year: "",
      price: "",
    });
  };

  const onSubmit = async (data: TCreatePoster) => {
    const sucess = await posterCreate(data);
    if (sucess) {
      onSucessModalOpen();
    }
    closeAndReset();
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={closeAndReset} closeOnOverlayClick>
        <ModalOverlay />
        <ModalContent
          color={"grey.1"}
          as={"form"}
          onSubmit={handleSubmit(onSubmit)}
          background={"white"}
          rounded={"8px"}
          p={{ base: "18px 0px 32px 0px", md: "" }}
          w={"100%"}
          maxW={"520px"}
          display={"flex"}
          flexDirection={"column"}
          gap={"18px"}
        >
          <Flex w={"100%"} align={"center"} px={{ base: "16px", md: "24px" }} position={"relative"}>
            <Heading fontWeight={"medium"} fontSize={"heading.7"}>
              Criar anúncio
            </Heading>
            <ModalCloseButton color={"grey.4"} top={"-5px"} right={{ base: "10px", md: "15px" }} />
          </Flex>
          <Flex direction={"column"} gap={"24px"} px={{ base: "24px", md: "30px" }}>
            <Text fontWeight={"medium"} color={"black"} fontSize={"body.2"}>
              Informações do veículo
            </Text>

            <FormControl id="brand" isInvalid={!!errors.brand?.message} position={"relative"}>
              <FormLabel fontSize={"body.2"} fontWeight={"medium"}>
                Marca
              </FormLabel>
              <Input
                value={brandSearch}
                {...register("brand", {
                  onChange(e: React.ChangeEvent<HTMLInputElement>) {
                    handleBrandSearch(e.target.value.trim());
                  },
                })}
                type="text"
                placeholder="Mercedes Benz"
                autoComplete={"off"}
                onBlur={() => {
                  if (brandFilterArray.length == 1 && brandFilterArray[0] == brandSearch) {
                    setBrandFilterArray([]);
                  }
                }}
              />

              {brandFilterArray.length != 0 && (
                <List
                  maxH={"160px"}
                  overflowY={"scroll"}
                  sx={{
                    "::-webkit-scrollbar": {
                      width: "6px",
                    },
                    "::-webkit-scrollbar-track": {
                      width: "2px",
                    },
                    "::-webkit-scrollbar-thumb": {
                      background: "brand.3",
                      borderRadius: "24px",
                    },
                  }}
                  position={"absolute"}
                  w={"100%"}
                  right={0}
                  zIndex={"dropdown"}
                  bg={"sucess.3"}
                  rounded={"0px 0px 4px 4px"}
                  display={"flex"}
                  flexDirection={"column"}
                  boxShadow={"lg"}
                  color={"sucess.1"}
                >
                  {brandFilterArray.map((brand, index) => (
                    <ListItem
                      role="button"
                      _hover={{
                        bg: "brand.4",
                      }}
                      p={"8px 8px"}
                      key={index}
                      onClick={() => {
                        setBrandSearch(brand);
                        setBrandFilterArray([]);
                      }}
                    >
                      <Text fontSize={"body.1"} fontWeight={"bold"}>
                        {brand}
                      </Text>
                    </ListItem>
                  ))}
                </List>
              )}
              <FormErrorMessage>{errors.brand?.message}</FormErrorMessage>
            </FormControl>
            <FormControl id="model" isInvalid={!!errors.model?.message} position={"relative"}>
              <FormLabel fontSize={"body.2"} fontWeight={"medium"}>
                Modelo
              </FormLabel>
              <Input
                {...register("model", {
                  onChange(e: React.ChangeEvent<HTMLInputElement>) {
                    handleModelSearch(e.target.value);
                  },
                })}
                autoComplete={"off"}
                onBlur={() => {
                  if (modelFilterArray.length == 1 && modelFilterArray[0] == modelSearch) {
                    setModelFilterArray([]);
                  }
                }}
                value={modelSearch}
                type="text"
                placeholder="A 200 CGI ADVANCE SEDAN"
              />
              <FormErrorMessage>{errors.model?.message}</FormErrorMessage>
              {modelFilterArray.length != 0 && (
                <List
                  maxH={"160px"}
                  overflowY={"scroll"}
                  sx={{
                    "::-webkit-scrollbar": {
                      width: "6px",
                    },
                    "::-webkit-scrollbar-track": {
                      width: "2px",
                    },
                    "::-webkit-scrollbar-thumb": {
                      background: "brand.3",
                      borderRadius: "24px",
                    },
                  }}
                  position={"absolute"}
                  w={"100%"}
                  right={0}
                  zIndex={"dropdown"}
                  bg={"sucess.3"}
                  rounded={"0px 0px 4px 4px"}
                  display={"flex"}
                  flexDirection={"column"}
                  boxShadow={"lg"}
                  color={"sucess.1"}
                >
                  {modelFilterArray.map((model, index) => (
                    <ListItem
                      role="button"
                      _hover={{
                        bg: "brand.4",
                      }}
                      p={"8px 8px"}
                      key={index}
                      onClick={() => {
                        setModelSearch(model);
                        setModelFilterArray([]);
                      }}
                    >
                      <Text fontSize={"body.1"} fontWeight={"bold"}>
                        {model}
                      </Text>
                    </ListItem>
                  ))}
                </List>
              )}
            </FormControl>
            <Flex gap={{ base: "12px", md: "16px" }}>
              <FormControl id="year">
                <FormLabel fontSize={"body.2"} fontWeight={"medium"}>
                  Ano
                </FormLabel>
                <Input {...register("year")} readOnly type="text" placeholder="2018" />
              </FormControl>
              <FormControl id="fuel_type">
                <FormLabel fontSize={"body.2"} fontWeight={"medium"}>
                  Combustível
                </FormLabel>
                <Input
                  {...register("fuel_type")}
                  readOnly
                  type="text"
                  placeholder="Gasolina / Etanol"
                />
              </FormControl>
            </Flex>
            <Flex gap={{ base: "12px", md: "16px" }}>
              <FormControl id="km" isInvalid={!!errors.kilometers?.message}>
                <FormLabel fontSize={"body.2"} fontWeight={"medium"}>
                  Quilometragem
                </FormLabel>
                <Input
                  {...register("kilometers")}
                  autoComplete="off"
                  type="number"
                  min={0}
                  step={"1"}
                  placeholder="30.000"
                />
                <FormErrorMessage>{errors.kilometers?.message}</FormErrorMessage>
              </FormControl>
              <FormControl id="color" isInvalid={!!errors.color?.message}>
                <FormLabel fontSize={"body.2"} fontWeight={"medium"}>
                  Cor
                </FormLabel>
                <Input {...register("color")} type="text" placeholder="Branco" />
                <FormErrorMessage>{errors.color?.message}</FormErrorMessage>
              </FormControl>
            </Flex>
            <Flex gap={{ base: "12px", md: "16px" }}>
              <FormControl id="fipe_price">
                <FormLabel fontSize={"body.2"} fontWeight={"medium"}>
                  Preço tabela FIPE
                </FormLabel>
                <InputGroup>
                  <InputLeftAddon
                    bg={"grey.8"}
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={"center"}
                    h={"48px"}
                    p={"0px 8px"}
                    color={"grey.3"}
                    children="R$"
                  />
                  <Input
                    {...register("fipe_price")}
                    readOnly
                    autoComplete="off"
                    paddingLeft={"8px"}
                    type="text"
                    placeholder="48.000,00"
                  />
                </InputGroup>
              </FormControl>
              <FormControl id="price" isInvalid={!!errors.price?.message}>
                <FormLabel fontSize={"body.2"} fontWeight={"medium"}>
                  Preço
                </FormLabel>
                <InputGroup>
                  <InputLeftAddon
                    bg={"grey.8"}
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={"center"}
                    h={"48px"}
                    p={"0px 8px"}
                    color={"grey.3"}
                    children="R$"
                  />
                  <Input
                    {...register("price", {
                      onChange(e: React.ChangeEvent<HTMLInputElement>) {
                        brlCurrencyMask(e);
                      },
                    })}
                    paddingLeft={"8px"}
                    autoComplete="off"
                    type="text"
                    placeholder="50.000,00"
                  />
                </InputGroup>
                <FormErrorMessage>{errors.price?.message}</FormErrorMessage>
              </FormControl>
            </Flex>

            <FormControl id="description" isInvalid={!!errors.description?.message}>
              <FormLabel fontSize={"body.2"} fontWeight={"medium"}>
                Descrição
              </FormLabel>
              <Textarea
                {...register("description")}
                maxLength={500}
                placeholder="Descreva seu anúncio aqui"
              />
              <FormErrorMessage>{errors.description?.message}</FormErrorMessage>
            </FormControl>

            {fields.map((field, index) => (
              <FormControl
                id={`img${index}`}
                key={field.id}
                isInvalid={!!errors.images?.[index]?.url?.message}
              >
                <FormLabel fontSize={"body.2"} fontWeight={"medium"}>
                  {!index ? "Imagem da capa" : `${index}º Imagem da galeria`}
                </FormLabel>
                <InputGroup>
                  <Input
                    type="url"
                    {...register(`images.${index}.url`)}
                    placeholder="https://imagem.com"
                  />
                  <InputRightElement>
                    <IconButton
                      bg="alert.3"
                      color="alert.1"
                      _hover={{ bg: "alert.2" }}
                      aria-label="trash"
                      fontSize={"heading.5"}
                      onClick={() => remove(index)}
                      isDisabled={fields.length < 4}
                      icon={<FiTrash />}
                    />
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage>{errors.images?.[index]?.url?.message}</FormErrorMessage>
              </FormControl>
            ))}

            <Box>
              <Button
                onClick={() => append({ url: "" })}
                w={"100%"}
                maxW={"max-content"}
                variant={"brandOpacity"}
                isDisabled={fields.length >= 6}
              >
                <Text maxW={"100%"} overflow={"hidden"} textOverflow={"ellipsis"}>
                  Adicionar campo para imagem da galeria
                </Text>
              </Button>
            </Box>
            <Flex mt={{ base: "12px", md: "18px" }} gap={"10px"} justify={"flex-end"}>
              <Button w={"50%"} maxW={"130px"} size={"lg"} variant={"negative"}>
                Cancelar
              </Button>
              <Button type="submit" w={"50%"} maxW={"190px"} size={"lg"} variant={"brandDisable"}>
                Criar anúncio
              </Button>
            </Flex>
          </Flex>
        </ModalContent>
      </Modal>
    </>
  );
};

export default PosterCreateEditModal;
