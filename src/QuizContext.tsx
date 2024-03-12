import { createContext, useContext, useReducer } from "react";

type Status = "idle" | "fetching" | "ready" | "error" | "answered" ;

type QuizAction = 
{ type: "setStatus"; payload: Status } | 
{ type: "setQuestion"; payload: Question } |
{ type: "setUserAnswer"; payload: string  | null} |
{ type: "setScore"; payload: "correct" | "incorrect"} ;


export interface Question {
	type: "multiple" | "boolean"; // Assuming only two types: multiple choice or true/false
	difficulty: "easy" | "medium" | "hard"; // Difficulty level
	category: string; // Category of the question
	question: string; // The question itself
	correct_answer: string; // The correct answer
	incorrect_answers: string[]; // Array of incorrect answers
}

export interface QuizApiResponse {
	response_code: number; // Response code from the API
	results: Question[]; // Array of questions
}

interface QuizContext {
	state: QuizState;
	dispatch: React.Dispatch<QuizAction>;
}

interface Score {
	correct: number, 
	incorrect: number 
}

interface QuizState {
    question: Question | null,
	gameStatus: Status,
	userAnswer: string | null,
	score: Score
}

interface Props {
	children: React.ReactElement;
}

const initialState: QuizState = { 
    gameStatus: "idle",
    question: null,
	userAnswer: null,
	score: { correct: 0, incorrect: 0 }
};

const QuizContext = createContext<QuizContext>({
	state: initialState,
	dispatch: () => null,
});

export function QuizProvider({ children }: Props) {
	const [state, dispatch] = useReducer(QuizReducer, initialState);

	return (
		<QuizContext.Provider value={{ state, dispatch }}>
			{children}
		</QuizContext.Provider>
	);
}

export function useQuiz() {
	return useContext(QuizContext);
}

function QuizReducer(state: QuizState, action: QuizAction): QuizState {

	switch (action.type) {
        case "setQuestion":
			return { ...state, question : action.payload };
		case "setStatus":
			return { ...state, gameStatus: action.payload };
		case "setUserAnswer":
			return { ...state, userAnswer: action.payload };
		case "setScore":
			let score = state.score;
			score[action.payload] += 1;
			return { ...state, score: score };
		default:
			throw new Error("Unknow");
	}

}
