import { CategoryPageContext } from "@/app/(frontend)/painel/eventos/_shared/components/categories/context/CategoryPage.ctx";
import { For, Link, SubmitButton } from "odinkit";
import {
  Button,
  Form,
  Input,
  Label,
  Select,
  showToast,
  useAction,
} from "odinkit/client";
import { useContext, useMemo } from "react";
import { useFieldArray } from "react-hook-form";
import { nestUpload } from "@/app/api/uploads/action";
import ModalityCategoryModal from "./CategoryDocumentModal";
import { upsertEventModalityCategories } from "@/app/api/categories/action";

export function CategoriesForm() {
  const {
    categoryForm,
    showForm,
    setShowForm,
    setSelectedCategory,
    selectedCategory,
    modality,
  } = useContext(CategoryPageContext);

  const {
    data: categoryData,
    trigger: categoriesTrigger,
    isMutating: modalityCategoryLoading,
  } = useAction({
    action: upsertEventModalityCategories,
    redirect: false,
    onSuccess: () => {
      showToast({
        message: "Categorias atualizadas com sucesso!",
        title: "Sucesso",
        variant: "success",
      });
    },
    onError: () =>
      showToast({
        message: "Erro ao atualizar categorias!",
        title: "Erro",
        variant: "error",
      }),
  });

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control: categoryForm.control,
      name: "categories",
    }
  );
  const CategoryField = useMemo(() => categoryForm.createField(), []);

  return (
    <>
      <Form hform={categoryForm} onSubmit={(data) => categoriesTrigger(data)}>
        <For each={fields} identifier="category">
          {(item, index) => (
            <div className="grid grid-cols-2 gap-2 border-b py-4">
              <CategoryField
                className={"col-span-1"}
                name={`categories.${index}.name`}
              >
                <Label>Nome</Label>
                <Input placeholder="Ex.: Pro" />
              </CategoryField>
              <CategoryField
                className={"col-span-1"}
                name={`categories.${index}.gender`}
              >
                <Label>Sexo</Label>
                <Select
                  data={[
                    { name: "Feminino", id: "female" },
                    { name: "Masculino", id: "male" },
                    { name: "Unisex", id: "unisex" },
                  ]}
                  valueKey="id"
                  displayValueKey="name"
                />
              </CategoryField>

              <div className="grid grid-cols-2 gap-2">
                <CategoryField
                  className={"col-span-1"}
                  name={`categories.${index}.minAge`}
                >
                  <Label>Idade Mínima</Label>
                  <Input inputMode="numeric" type="number" />
                </CategoryField>
                <CategoryField
                  className={"col-span-1"}
                  name={`categories.${index}.maxAge`}
                  typeof="number"
                >
                  <Label>Idade Máxima</Label>
                  <Input inputMode="numeric" type="number" />
                </CategoryField>
              </div>

              <Button
                className={"my-auto"}
                onClick={() => {
                  setSelectedCategory(modality.modalityCategory[index]);
                }}
              >
                Editar Documentos
              </Button>

              {index > 0 && (
                <Link
                  href={"#"}
                  className={"col-span-2 text-red-600 underline"}
                  onClick={() => {
                    remove(index);
                  }}
                >
                  Remover Categoria {item.name}
                </Link>
              )}
            </div>
          )}
        </For>
        <SubmitButton>Salvar</SubmitButton>
        <Button
          className={"my-auto"}
          onClick={() => {
            append({
              eventModalityId: modality.id,
              gender: "unisex",
              maxAge: 0,
              minAge: 0,
              name: "",
            });
          }}
        >
          Adicionar Categoria
        </Button>
      </Form>
      <ModalityCategoryModal />
    </>
  );
}
