const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const userDB = {
  id: 1,
  email: "test@test.test",
  password: "123",
};

passport.serializeUser(function (user, done) {
  console.log("Сериализация", user);
  done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
  console.log("Десериализация", id);
  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
  });
  const userDes = user.id === id ? user : false;
  done(null, userDes);
});

passport.use(
  new LocalStrategy({ usernameField: "email" }, async function (
    email,
    password,
    done
  ) {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!user) {
      return done(null, false, { message: "Не найден" });
    }
    if (password === user.passwordHash) {
      console.log("Успешно!");
      return done(null, user, { message: "welcome!" });
    } else {
      return done(null, false, { message: "Че то не так" });
    }
  })
);
