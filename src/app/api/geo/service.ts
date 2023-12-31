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

export async function getStates() {
  const states = await prisma.state.findMany();
  return states;
}

export async function getCitiesByState({ stateId }: { stateId: string }) {
  const cities = await prisma.city.findMany({
    where: {
      stateId: stateId,
    },
  });
  return cities;
}

export async function getAddressFromZipCode({ zipCode }: { zipCode: string }) {
  const response: Promise<ViaCepResponse> = (
    await fetch(`https://viacep.com.br/ws/${zipCode}/json/`)
  ).json();

  const city = await prisma.city.findFirst({
    where: {
      ibge: zipCode,
    },
  });
}
