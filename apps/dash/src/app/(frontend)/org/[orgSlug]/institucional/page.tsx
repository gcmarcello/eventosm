import dayjs from "dayjs";
import { notFound } from "next/navigation";
import { BiFileEarmarkPdf, For, Heading, TabItem, Table, Text } from "odinkit";
import { DisclosureAccordion } from "odinkit/client";
import PublicOrgDocumentsTable from "./components/PublicOrgDocumentsTable";
import OrgFooter from "../../_shared/OrgFooter";

export default async function InstitutionalPage({
  params,
}: {
  params: { orgSlug: string };
}) {
  const organization = await prisma.organization.findUnique({
    where: { slug: params.orgSlug },
  });

  if (!organization || !organization.options.pages?.documents)
    return notFound();

  const documents = await prisma.organizationDocument.findMany({
    where: { organizationId: organization.id, status: "published" },
  });

  const years = [
    ...new Set(documents.map((obj) => dayjs(obj.createdAt).year())),
  ];

  return (
    <>
      <div className="pb-20">
        <div className="mx-auto max-w-7xl rounded-b-md bg-white px-4  pt-8 lg:gap-x-8 lg:px-8">
          <Heading>Institucional e Transparência</Heading>
          <div className="my-2 space-y-2 text-sm">
            <Text>
              Bem-vindo à página Institucional e de Transparência da{" "}
              {organization.name}! Aqui você poderá acessar nossos estatutos,
              regulamentos, atas de reuniões e outros documentos importantes.
              Também fornecemos informações sobre nossa estrutura
              organizacional, incluindo os membros de nosso conselho e equipe
              administrativa.
            </Text>
            <Text className="hidden lg:block">
              Além disso, nossa página de Transparência oferece informações
              sobre nosso orçamento, finanças e investimentos. Publicamos
              anualmente nossos balanços financeiros, demonstrações de
              resultados e relatórios de auditoria, para que nossos membros
              possam acompanhar o desempenho financeiro de nossa entidade.
              Estamos comprometidos em manter um alto nível de integridade e
              ética em nossas operações.
            </Text>
            <Text className="hidden lg:block">
              Como tal, nossa página de Transparência e Institucional é
              atualizada regularmente e estamos sempre disponíveis para
              responder a quaisquer dúvidas ou preocupações que nossos membros
              possam ter.
            </Text>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Heading>Documentos em Destaque</Heading>
              <PublicOrgDocumentsTable
                documents={documents.filter((doc) => doc.highlight)}
              />
            </div>

            <div className="space-y-2">
              <Heading>Documentos por Ano</Heading>
              <For each={years}>
                {(tab, index) => (
                  <DisclosureAccordion title={String(tab)}>
                    <PublicOrgDocumentsTable
                      showDate={false}
                      documents={documents.filter(
                        (doc) => dayjs(doc.updatedAt).year() === tab
                      )}
                    />
                  </DisclosureAccordion>
                )}
              </For>
            </div>
          </div>
        </div>
      </div>
      <OrgFooter organization={organization} />
    </>
  );
}
