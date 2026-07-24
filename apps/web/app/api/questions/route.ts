import { NextResponse } from "next/server";

const questions = [
  {
    qId: "Q_1",
    qNumber: 1,
    question: "What does HTML stand for?",
    options: {
      a: "Hyper Text Markup Language",
      b: "High Tech Modern Language",
      c: "Hyper Transfer Markup Language",
      d: "Home Tool Markup Language",
    },
  },
  {
    qId: "Q_2",
    qNumber: 2,
    question: "Which planet is known as the Red Planet?",
    options: {
      a: "Venus",
      b: "Jupiter",
      c: "Mars",
      d: "Saturn",
    },
  },
  {
    qId: "Q_3",
    qNumber: 3,
    question: "What is the capital of Japan?",
    options: {
      a: "Seoul",
      b: "Tokyo",
      c: "Beijing",
      d: "Bangkok",
    },
  },
  {
    qId: "Q_4",
    qNumber: 4,
    question: "Which language is used for styling web pages?",
    options: {
      a: "HTML",
      b: "JavaScript",
      c: "Python",
      d: "CSS",
    },
  },
  {
    qId: "Q_5",
    qNumber: 5,
    question: "What does CPU stand for?",
    options: {
      a: "Central Process Unit",
      b: "Central Processing Unit",
      c: "Computer Personal Unit",
      d: "Central Peripheral Unit",
    },
  },
];

export async function GET() {
  return NextResponse.json(questions);
}
