import { posterContext } from "@/contexts/PosterContext";
import { IComment } from "@/interfaces/comment.interfaces";
import { commentSchema } from "@/schemas";
import { Avatar, Button, Flex, FormControl, FormLabel, Heading, Input, Modal, ModalCloseButton, ModalContent, ModalOverlay, Text, useDisclosure } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import moment from "moment";
import "moment/locale/pt-br";
import { useForm } from "react-hook-form";
import DeleteModal from "./DeleteModal";
import { useState } from "react";
import { TCreatePoster } from "@/interfaces/poster.interfaces";

interface IPosterCommentProps {
  username: string;
  content: string;
  createdAt: string;
}

interface ICommentEditModal extends IPosterCommentProps {
  isOpen: boolean;
  onClose: () => void;
  onSucessModalOpen?: () => void;
  setComments: React.Dispatch<React.SetStateAction<IComment[]>>;
  comment?: IComment | null;
  edit?: boolean;
}

const PosterComment = ({ 
  isOpen,
  onClose,
  onSucessModalOpen,
  setComments,
  edit,
  comment,
  username, 
  content, 
  createdAt 
}: ICommentEditModal) => {

  const { commentCreate, commentEdit, commentDelete } = posterContext();

  const [contents, setContents] = useState<string>("");


  const {
    isOpen: isConfirmDeleteOpen,
    onOpen: onConfirmDeleteOpen,
    onClose: onConfirmDeleteClose,
  } = useDisclosure();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<IComment>({
    resolver: zodResolver(commentSchema)
  });


  const closeAndReset = () => {
    onClose();
    reset({
      content: ""
    });
  };

  const deleteFunction = async () => {
    if (edit && comment) {
      const deleted = await commentDelete(comment.id);
      if (deleted) {
        setComments((old) => old.filter((el) => el.id !== comment.id));
        onConfirmDeleteClose();
        closeAndReset();
      }
    }
  };

  const onSubmit = async (id: string, data: IComment) => {
    if (!edit) {
      const createdComment = await commentCreate(id, data.content);
      if (createdComment) {
        setComments((old) => [createdComment, ...old]);
        onSucessModalOpen!();
      }
    } else {
      if (comment) {
        const updatedComment = await commentEdit(comment.id, data);
        if (updatedComment) {
          setComments((old) =>
            old.map((el) => {
              if (el.id == updatedComment.id) {
                return updatedComment;
              }
              return el;
            })
          );
        }
      }
    }
    closeAndReset();
  };

  return (
    <>
    <Flex alignItems={"center"} gap={"8px"} flexWrap={"wrap"}>
      <Avatar
        name={username}
        w={"32px"}
        h={"32px"}
        sx={{
          div: {
            fontSize: "heading.8",
            fontWeight: "medium",
          },
        }}
      />
      <Heading
        lineHeight={"heading.6"}
        fontWeight={"semibold"}
        fontSize={"heading.8"}
        as={"h3"}
        color={"grey.1"}
      >
        {username}
      </Heading>
      <Text as={"span"} lineHeight={"body.2"} fontSize={"body.3"} color={"grey.4"}>
        •
      </Text>
      <Text lineHeight={"body.2"} fontSize={"body.3"} color={"grey.3"}>
        {moment(createdAt).fromNow()}
      </Text>
      <Text
        fontWeight={"normal"}
        lineHeight={"body.2"}
        fontSize={"body.2"}
        w={"100%"}
        color={"grey.2"}
      >
        {content}
      </Text>
    </Flex>

    {
      <>
      <Modal isOpen={isOpen} onClose={closeAndReset} closeOnOverlayClick>
        <ModalOverlay w={"100%"} h={"100%"} />
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
            <Heading fontWeight={"semibold"} fontSize={"heading.7"}>
              {edit ? "Editar comentário" : "Criar comentário"}
            </Heading>
            <ModalCloseButton color={"grey.4"} top={"-5px"} right={{ base: "10px", md: "15px" }} />
          </Flex>
          <Flex direction={"column"} gap={"24px"} px={{ base: "24px", md: "30px" }}>

            <FormControl id="content" position={"relative"}>
              <FormLabel fontSize={"body.2"} fontWeight={"semibold"}>
                comentário
              </FormLabel>
              <Input
                value={content}
                type="text"
                placeholder=""
                autoComplete={"off"}
              />

            {edit ? (
              <Flex mt={{ base: "12px", md: "18px" }} gap={"10px"}>
                <Button
                  onClick={onConfirmDeleteOpen}
                  w={{ base: "50%", md: "60%" }}
                  size={"lg"}
                  variant={"negative"}
                >
                  Excluir comentário
                </Button>
                <Button
                  type="submit"
                  w={{ base: "50%", md: "40%" }}
                  size={"lg"}
                  variant={"brandDisable"}
                  minW={"138px"}
                >
                  Salvar alterações
                </Button>
              </Flex>
            ) : (
              <Flex mt={{ base: "12px", md: "18px" }} gap={"10px"} justify={"flex-end"}>
                <Button onClick={onClose} w={"50%"} maxW={"130px"} size={"lg"} variant={"negative"}>
                  Cancelar
                </Button>
                <Button type="submit" w={"50%"} maxW={"190px"} size={"lg"} variant={"brandDisable"}>
                  Criar comentário
                </Button>
              </Flex>
            )}
          </Flex>
        </ModalContent>
      </Modal>

    <DeleteModal
      isOpen={isConfirmDeleteOpen}
      onClose={onConfirmDeleteClose}
      deleteFunction={deleteFunction}
      headingText="Excluir comentário"
      title="Tem certeza que deseja excluir esse comentário?"
      description="Essa ação não pode ser desfeita. Isso excluirá permanentemente seu comentário."
      buttonText="Sim, excluir meu comentário"
    />
    
    </>
    }

  </>
  );
};

export default PosterComment;
