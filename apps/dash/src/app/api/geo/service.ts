import { normalize } from "odinkit";
import { prisma } from "prisma/prisma";

type ViaCepResponse = {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
};

export async function readStates() {
  const states = await prisma.state.findMany({ orderBy: { uf: "asc" } });
  return states;
}

export async function readCitiesByState({ stateId }: { stateId: string }) {
  const cities = await prisma.city.findMany({
    where: {
      stateId: stateId,
    },
  });
  return cities;
}

export async function readAddressFromZipCode({ zipCode }: { zipCode: string }) {
  const response: Response = await fetch(
    `https://viacep.com.br/ws/${normalize(zipCode)}/json/`
  );
  const parsedResponse: ViaCepResponse = await response.json();

  const ibge = parsedResponse?.ibge;

  if (!ibge) throw "CEP Inválido";

  const cityAndState = await prisma.city.findFirst({
    where: {
      id: ibge,
    },
    include: { state: true },
  });

  return {
    address: parsedResponse.logradouro,
    city: { name: cityAndState?.name, id: cityAndState?.id },
    state: { name: cityAndState?.state.uf, id: cityAndState?.state.id },
  };
}
