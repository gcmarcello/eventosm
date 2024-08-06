import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "../auth.controller";
import { AuthService } from "../auth.service";
import { UserService } from "@/resources/users/user.service";
import { Gender } from "shared-types/dist/resources/user/user.dto";

const newUserObj = {
  firstName: "Marcello",
  lastName: "Coelho",
  email: "marcellog.c@hotmail.com",
  document: "438.951.248-00",
  phone: "(13) 99163-7646",
  password: "123456",
  acceptTerms: true,
  info: {
    birthDate: "18/08/1997",
    gender: "male" as Gender,
    zipCode: "11320-001",
    address: "Av Pres Wilson",
    number: "415",
    complement: "AP 201",
    city: "1",
    state: "1",
  },
};

const userObjReturn = {
  id: "fc0afc10-e3f3-49fd-bc5d-93cbb14c2381",
  createdAt: "2024-06-10T20:57:46.721Z",
  updatedAt: "2024-06-10T20:57:46.721Z",
  firstName: "Marcello",
  lastName: "Coelho",
  email: "marcellog.c@hotmail.com",
  document: "43895124800",
  phone: "(13) 99163-7646",
  password: "$2b$10$zCmw3EmVon/hyyg6e0yt8eJOOlhTPD8siNmluZeBh4PAF0mqisYe.",
  role: "user",
  confirmed: false,
  info: {
    id: "9e51cab9-8c09-4ce5-a728-aed41d0bf23e",
    createdAt: "2024-06-10T20:57:46.720Z",
    updatedAt: "2024-06-10T20:57:46.720Z",
    birthDate: "1997-08-18T00:00:00.000Z",
    gender: "male",
    zipCode: "11320-001",
    address: "Av Pres Wilson",
    number: "415",
    complement: "AP 201",
    state: "1",
    city: "1",
  },
  documents: [],
  fullName: "Marcello Coelho",
};

const loginObj = {
  identifier: "identifier@identifier.com",
  password: "123456",
};

const token = "TOKEN";

describe("AuthController", () => {
  let controller: AuthController;

  const mockAuthService = {
    login: jest.fn(() => token),
    signup: jest.fn(() => userObjReturn),
  };
  const mockUserService = {
    create: jest.fn(() => userObjReturn),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService, UserService],
    })
      .overrideProvider(UserService)
      .useValue(mockUserService)
      .overrideProvider(AuthService)
      .useValue(mockAuthService)
      .compile();
    controller = module.get<AuthController>(AuthController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("should create a new user", async () => {
    expect(await controller.signup(newUserObj)).toEqual(userObjReturn);
    expect(mockUserService.create).toHaveBeenCalledWith(newUserObj);
  });

  it("should login", async () => {
    expect(await controller.login(loginObj)).toEqual(token);
  });
});
