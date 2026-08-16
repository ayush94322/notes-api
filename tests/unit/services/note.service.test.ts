import { beforeEach, describe, expect, it, vi } from "vitest";
import {NoteService} from "../../../src/services/note.service";
import { NotFoundError } from "../../../src/errors/NotFoundError";

const repository = {
    findById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    softDelete: vi.fn(),
    restore: vi.fn(),
    permanentDelete: vi.fn(),
    getStats: vi.fn(),
    bulkDelete: vi.fn(),
    bulkArchive: vi.fn(),
    bulkRestore: vi.fn(),
    bulkFavorite: vi.fn()
};

let service: NoteService;
beforeEach(()=>{
    vi.clearAllMocks();

    service = new NoteService(
        repository as any
    );
});

describe("NoteService.findById", ()=>{
    it("should return a note when it exists", async ()=>{
        const note = {
            id: "note-1",
            title: "Test Note",
            content: "Testing",
            userId: "user-1"
        };
        repository.findById.mockResolvedValue(note);
        const result = await service.findById(
            "note-1",
            "user-1"
        );
        expect(result).toEqual(note);
        expect(repository.findById).toHaveBeenCalledWith(
            "note-1",
            "user-1"
        );
    });

    it("should throw NotFoundError when note does not exist", async ()=>{
        repository.findById.mockResolvedValue(null);
        await expect(service.findById(
            "invalid-id",
            "user-1"
        )).rejects.toThrow(
            new NotFoundError("Note Not Found")
        );
        expect(repository.findById).toHaveBeenCalledWith(
            "invalid-id",
            "user-1"
        );
    });
});

describe("NoteService.create", () => {
  it("should create a note", async () => {

    const createdNote = {
      id: "note-1",
      title: "Test Note",
      content: "Testing service",
      userId: "user-1",
    };

    repository.create.mockResolvedValue(
      createdNote
    );

    const result = await service.create(
      "Test Note",
      "Testing service",
      "user-1"
    );

    expect(result).toEqual(
      createdNote
    );

    expect(
      repository.create
    ).toHaveBeenCalledWith({
      title:"Test Note",
      content: "Testing service",
      userId: "user-1"
    });
  });
});

describe("NoteService.update", ()=>{
  it("should update a note", async ()=>{
    const data = {
      title: "Updated"
    };

    const note = {
      id: "note-1",
      title: "Updated",
      content: "Hello",
      userId: "user-1"
    };
    
    repository.update.mockResolvedValue({
      count: 1
    });
    repository.findById.mockResolvedValue(note);
    const result = await service.update(
      "note-1",
      "user-1",
      data
    );
    expect(result).toEqual(note);
    expect(repository.update).toHaveBeenCalledWith(
      "note-1",
      "user-1",
      data
    );
    
    expect(repository.findById).toHaveBeenCalledWith(
      "note-1",
      "user-1"
    );
  });

  it("should throw error when note does not exist", async ()=>{
    repository.update.mockResolvedValue({
      count: 0
    });
    await expect(
      service.update(
        "note-1",
        "user-1",
        {
          title: "Updated"
        }
      )
    ).rejects.toThrow(
      "Note Not Found"
    );
  });
});

describe("NoteService.softDelete", ()=>{
  it("should soft delete a note", async ()=>{
    const note = {
      id: "note-1",
      title: "Test Note",
      content: "Hello",
      userId: "user-1",
      deletedAt: new Date()
    };

    repository.softDelete.mockResolvedValue({
      count: 1
    });
    const result = await service.softDelete(
      "note-1",
      "user-1"
    );
    expect(result).toBeUndefined();
    expect(repository.softDelete).toHaveBeenCalledWith(
      "note-1",
      "user-1"
    );
  });

  it("should throw error when note does not exist", async ()=>{
    repository.softDelete.mockResolvedValue({
      count: 0
    });
    await expect(service.softDelete(
      "note-1",
      "user-1"
    )).rejects.toThrow("Note Not Found");
  });
});

describe("NoteService.restore", ()=>{
  it("should restore a note", async ()=>{
    const note = {
      id: "note-1",
      title: "My Note",
      content: "Hello",
      userId: "user-1",
      deletedAt: null
    };
    repository.restore.mockResolvedValue({
      count: 1
    });
    repository.findById.mockResolvedValue(note);
    const result = await service.restore(
      "note-1",
      "user-1"
    );
    expect(result).toEqual(note);
    expect(repository.restore).toHaveBeenCalledWith(
      "note-1",
      "user-1"
    );
  });
  it("should throw error when note does not exist", async ()=>{
    repository.restore.mockResolvedValue({
      count: 0
    });
    await expect(service.restore(
      "note-1",
      "user-1"
    )).rejects.toThrow("Note Not Found");
  });
});

describe("NoteService.getStats", ()=>{
  it("should return statistics", async ()=>{
    const stats = {
      total: 10,
      active: 7,
      deleted: 3,
      favorites: 2,
      archived: 4
    };
    repository.getStats.mockResolvedValue(stats);
    const result = await service.getStats(
      "user-1"
    );
    expect(result).toEqual(stats);
    expect(repository.getStats).toHaveBeenCalledWith(
      "user-1"
    );
  });
});

describe("NoteService.bulkDelete", ()=>{
  it("should bulk delete notes", async ()=>{
    const ids = ["note-1","note-2","note-3"];
    repository.bulkDelete.mockResolvedValue({deleted: 3});
    const result = await service.bulkDelete(
      ids,
      "user-1"
    );
    expect(result).toEqual({
      deleted: 3
    });
    expect(repository.bulkDelete).toHaveBeenCalledWith(
      ids,
      "user-1"
    );
  });
});

describe("NoteService.permanentDelete", () => {
  it("should permanently delete a note", async () => {
    repository.permanentDelete.mockResolvedValue({
      count: 1,
    });

    const result = await service.permanentDelete(
      "note-1",
      "user-1"
    );

    expect(result).toBeUndefined();

    expect(
      repository.permanentDelete
    ).toHaveBeenCalledWith(
      "note-1",
      "user-1"
    );
  });

  it("should throw error when note does not exist", async () => {
    repository.permanentDelete.mockResolvedValue({
      count: 0,
    });

    await expect(
      service.permanentDelete(
        "note-1",
        "user-1"
      )
    ).rejects.toThrow("Note Not Found");
  });
});

describe("NoteService.bulkArchive", () => {
  it("should archive multiple notes", async () => {
    const ids = [
      "note-1",
      "note-2",
      "note-3",
    ];

    const resultData = {
      archived: 3,
    };

    repository.bulkArchive.mockResolvedValue(
      resultData
    );

    const result = await service.bulkArchive(
      ids,
      "user-1"
    );

    expect(result).toEqual(resultData);

    expect(
      repository.bulkArchive
    ).toHaveBeenCalledWith(
      ids,
      "user-1"
    );
  });
});

describe("NoteService.bulkRestore", () => {
  it("should restore multiple notes", async () => {
    const ids = [
      "note-1",
      "note-2",
      "note-3",
    ];

    const resultData = {
      restored: 3,
    };

    repository.bulkRestore.mockResolvedValue(
      resultData
    );

    const result = await service.bulkRestore(
      ids,
      "user-1"
    );

    expect(result).toEqual(resultData);

    expect(
      repository.bulkRestore
    ).toHaveBeenCalledWith(
      ids,
      "user-1"
    );
  });
});

describe("NoteService.bulkFavorite", () => {
  it("should favorite multiple notes", async () => {
    const ids = [
      "note-1",
      "note-2",
      "note-3",
    ];

    const resultData = {
      count: 3,
    };

    repository.bulkFavorite.mockResolvedValue(
      resultData
    );

    const result = await service.bulkFavorite(
      ids,
      "user-1"
    );

    expect(result).toEqual(resultData);

    expect(
      repository.bulkFavorite
    ).toHaveBeenCalledWith(
      ids,
      "user-1"
    );
  });
});