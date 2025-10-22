import { useState, useEffect } from "react";
import { useList, useCreate, useUpdate, useDelete } from "@refinedev/core";
import type { DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';

// Components
import { QuestionsList } from './QuestionsList';
import { QuestionModal } from './QuestionModal';

// Types
import type { QuizQuestionsProps, QuizQuestion } from './types';
import { Button, Tag } from "antd";
import { PlusOutlined } from "@ant-design/icons";

// ============================================================================
// MAIN COMPONENT: QuizQuestions
// ============================================================================

export const QuizQuestions = ({ quizId }: QuizQuestionsProps) => {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<QuizQuestion | null>(null);

  // ============================================================================
  // REFINE HOOKS
  // ============================================================================

  const { mutate: createQuestion } = useCreate();
  const { mutate: updateQuestion } = useUpdate();
  const { mutate: deleteQuestion } = useDelete();

  // ============================================================================
  // DATA FETCHING
  // ============================================================================

  const questionsQuery = useList<QuizQuestion>({
    resource: "quiz_questions",
    filters: [
      {
        field: "quiz_id",
        operator: "eq",
        value: quizId,
      },
    ],
    sorters: [
      {
        field: "order_index",
        order: "asc",
      },
    ],
    queryOptions: {
      enabled: !!quizId,
    },
  });

  // ============================================================================
  // EFFECTS
  // ============================================================================

  // Load questions when data changes
  useEffect(() => {
    if (questionsQuery.result?.data) {
      setQuestions(questionsQuery.result.data);
    }
  }, [questionsQuery.result?.data]);

  // ============================================================================
  // MODAL FUNCTIONS
  // ============================================================================

  const openModal = (question?: QuizQuestion) => {
    if (question) {
      setEditingQuestion(question);
    } else {
      const newQuestion: QuizQuestion = {
        id: Date.now(),
        quiz_id: quizId,
        question: "",
        correct_answer: "",
        reason: "",
        order_index: questions.length + 1,
      };
      setEditingQuestion(newQuestion);
    }
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingQuestion(null);
  };

  // ============================================================================
  // CRUD OPERATIONS
  // ============================================================================

  const saveQuestion = (question: QuizQuestion) => {
    const { id, ...questionData } = question;

    try {
      if (questions.find(q => q.id === question.id)) {
        // Update existing question
        updateQuestion({
          resource: "quiz_questions",
          id: id,
          values: questionData,
        });

        // Update local state
        setQuestions(questions.map(q =>
          q.id === question.id ? question : q
        ));
      } else {
        // Create new question
        createQuestion({
          resource: "quiz_questions",
          values: questionData,
        });

        // Add to local state with temporary ID
        setQuestions([...questions, question]);
      }

      closeModal();
    } catch (error) {
      // Refine sẽ tự động hiển thị error notification
    }
  };

  const removeQuestion = (questionId: number) => {
    try {
      // Always try to delete from database
      deleteQuestion({
        resource: "quiz_questions",
        id: questionId,
      });

      // Remove from local state
      setQuestions(questions.filter(q => q.id !== questionId));

    } catch (error) {
      // Refine sẽ tự động hiển thị error notification
    }
  };

  // ============================================================================
  // DRAG & DROP HANDLERS
  // ============================================================================

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (!active || !over) {
      return;
    }
    if (active.id !== over.id) {
      setQuestions((prevState) => {
        const activeIndex = prevState.findIndex((item) => item.id === active.id);
        const overIndex = prevState.findIndex((item) => item.id === over.id);
        const newQuestions = arrayMove(prevState, activeIndex, overIndex);

        // Update order_index for all questions
        const updatedQuestions = newQuestions.map((question, index) => ({
          ...question,
          order_index: index + 1,
        }));

        // Update order_index in database for all questions
        updatedQuestions.forEach((question) => {
          updateQuestion({
            resource: "quiz_questions",
            id: question.id,
            values: { order_index: question.order_index },
            successNotification: false,
          });
        });

        return updatedQuestions;
      });
    }
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="tw:space-y-6">
      <div className="tw:flex tw:justify-between tw:items-center">
        <div className="tw:flex tw:items-center tw:space-x-3">
          <div className="tw:text-lg tw:font-medium">
            Quản lý câu hỏi
          </div>
          {questions.length > 0 && (
            <Tag color="blue">
              {questions.length} câu hỏi
            </Tag>
          )}
        </div>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => openModal()}
          className="tw:bg-blue-600 tw:border-blue-600 hover:tw:bg-blue-700"
        >
          Thêm câu hỏi
        </Button>
      </div>

      {/* ========================================================================
          QUESTIONS LIST WITH DRAG & DROP
      ========================================================================== */}
      <QuestionsList
        questions={questions}
        onEdit={openModal}
        onDelete={removeQuestion}
        onDragEnd={onDragEnd}
      />

      {/* ========================================================================
          QUESTION MODAL
      ========================================================================== */}
      <QuestionModal
        visible={modalVisible}
        question={editingQuestion}
        onSave={saveQuestion}
        onCancel={closeModal}
        onDelete={removeQuestion}
      />
    </div>
  );
};