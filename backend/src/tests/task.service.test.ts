import { taskService } from "../modules/tasks/task.service";
import { taskRepository } from "../modules/tasks/task.repository";
import { Types } from "mongoose";

/**
 * Mock the task repository to isolate TaskService logic.
 *
 * This allows unit testing without hitting a real database.
 */
jest.mock("../modules/tasks/task.repository");

/**
 * Test suite for TaskService.
 *
 * These tests validate:
 * - Task creation
 * - Authorization enforcement on updates
 * - Task deletion by the creator
 */
describe("TaskService", () => {
  const userId = new Types.ObjectId().toString();

  /**
   * Ensures that a task can be created successfully.
   *
   * Expectations:
   * - Task repository `create` method is called
   * - Returned task has correct title and creatorId
   */
  it("should create a task", async () => {
    const mockedCreate = taskRepository.create as jest.MockedFunction<
      typeof taskRepository.create
    >;

    mockedCreate.mockResolvedValue({
      _id: new Types.ObjectId().toString(),
      title: "Test Task",
      description: "Test description",
      dueDate: new Date(),
      priority: "Low",
      status: "To Do",
      creatorId: userId,
      assignedToId: userId,
    } as any);

    const result = await taskService.createTask(userId, {
      title: "Test Task",
      description: "Test description",
      dueDate: new Date().toISOString(),
      priority: "Low",
      status: "To Do",
      assignedToId: userId,
    });

    expect(result.title).toBe("Test Task");
    expect(result.creatorId).toBe(userId);
  });

  /**
   * Ensures that updating a task not owned by the user
   * throws an unauthorized error.
   *
   * Expectations:
   * - `findById` returns a task owned by another user
   * - Attempting to update results in a rejection
   */
  it("should throw error if updating task not owned by user", async () => {
    const mockedFindById = taskRepository.findById as jest.MockedFunction<
      typeof taskRepository.findById
    >;

    mockedFindById.mockResolvedValue({
      _id: new Types.ObjectId().toString(),
      creatorId: new Types.ObjectId().toString(),
      assignedToId: new Types.ObjectId().toString(),
    } as any);

    await expect(
      taskService.updateTask(
        new Types.ObjectId().toString(),
        userId,
        { status: "In Progress" }
      )
    ).rejects.toThrow("Unauthorized to update this task");
  });

  /**
   * Ensures that a task can be deleted if the user
   * is the creator of the task.
   *
   * Expectations:
   * - `findById` returns a task owned by the user
   * - `delete` method successfully removes the task
   * - Returned task ID matches requested task ID
   */
  it("should delete task if user is creator", async () => {
    const taskId = new Types.ObjectId().toString();
    const mockedFindById = taskRepository.findById as jest.MockedFunction<
      typeof taskRepository.findById
    >;
    const mockedDelete = taskRepository.delete as jest.MockedFunction<
      typeof taskRepository.delete
    >;

    mockedFindById.mockResolvedValue({ _id: taskId, creatorId: userId } as any);
    mockedDelete.mockResolvedValue({ _id: taskId } as any);

    const result = await taskService.deleteTask(taskId, userId);
    expect(result?._id).toBe(taskId);
  });
});
