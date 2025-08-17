"use client";
import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { toast, ToastContainer } from "react-toastify";
import { projectCategories } from "../constants";
import { useParams } from "next/navigation";

const EditProject = () => {
    const [open, setOpen] = useState(false);
    const [innerOpen, setInnerOpen] = useState(false);
    const [editingField, setEditingField] = useState(null);
    const [fieldValue, setFieldValue] = useState("");
    const [membersList, setMembersList] = useState([]); // for ProjectMembers array editing
    const [newMember, setNewMember] = useState("");

    const [project, setProject] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const res = await fetch(`/api/specific-project?id=${id}`);
                const data = await res.json();
                if (data.project) {
                    setProject(data.project);
                }
            } catch (e) {
                console.error("Could not fetch project", e);
            }
        };
        fetchProject();
    }, [id]);

    const handleEditClick = (field) => {
        setEditingField(field);

        // Special case for ProjectMembers
        if (field === "ProjectMembers" && Array.isArray(project.ProjectMembers)) {
            setMembersList(project.ProjectMembers);
        } else {
            let value = project[field] || "";
            if (Array.isArray(value)) value = value.join(",");
            setFieldValue(value);
        }

        setInnerOpen(true);
    };

    const handleSave = async () => {
        try {
            let updatedValue;

            if (editingField === "ProjectMembers") {
                updatedValue = membersList; // send array directly
            } else if (editingField === "ProjectTechnologies") {
                updatedValue = fieldValue.split(",").map((t) => t.trim());
            } else {
                updatedValue = fieldValue;
            }

            const res = await fetch(`/api/update-project?id=${id}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ [editingField]: updatedValue }),
            });

            const data = await res.json();
            if (res.ok) {
                toast.success(`${editingField} updated successfully`);
                setProject(data.project);
                setInnerOpen(false);
            } else {
                toast.error(`Failed to update ${editingField}`);
            }
        } catch (err) {
            console.error(err);
            toast.error("Server error");
        }
    };

    const handleRemoveMember = (name) => {
        setMembersList(membersList.filter((m) => m !== name));
    };

    const handleAddMember = () => {
        if (newMember.trim() && !membersList.includes(newMember.trim())) {
            setMembersList([...membersList, newMember.trim()]);
            setNewMember("");
        }
    };

    if (!project) {
        return (
            <main className="flex flex-col items-center justify-center p-6">
                Loading project...
            </main>
        );
    }

    return (
        <main className="flex flex-col items-center justify-center p-6">
            <ToastContainer position="top-center" autoClose={3000} />

            {/* Outer Dialog */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger className="px-4 py-2 hover:bg-gray-800 bg-blue-500 text-white rounded">
                    Edit Project
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-center">Project Details</DialogTitle>
                        <DialogDescription>
                            Click 'Edit' to modify any part of your project.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex flex-col gap-3 mt-3">
                        {[
                            "ProjectName",
                            "ProjectOwner",
                            "ProjectDescription",
                            "ProjectCategory",
                            "ProjectTechnologies",
                            "ProjectWebsiteLink",
                            "ProjectGithubLink",
                            "ProjectMembers",
                            "ProjectStatus",
                        ].map((field) => (
                            <div
                                key={field}
                                className="flex items-center justify-between border-b pb-2"
                            >
                                <div className='max-h-[50px] overflow-hidden'>
                                    <strong>{field.replace("Project", "")}: </strong>
                                    {Array.isArray(project[field])
                                        ? project[field].join(", ")
                                        : project[field]}
                                </div>
                                <button
                                    className="bg-blue-500 text-white px-3 py-1 rounded"
                                    onClick={() => handleEditClick(field)}
                                >
                                    Edit
                                </button>
                            </div>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>

            {/* Inner Dialog */}
            <Dialog open={innerOpen} onOpenChange={setInnerOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit {editingField}</DialogTitle>
                        <DialogDescription>
                            {editingField === "ProjectMembers"
                                ? "Manage your project members below."
                                : "Update the value and press Save to apply changes."}
                        </DialogDescription>
                    </DialogHeader>

                    {/* Special UI for ProjectMembers */}
                    {editingField === "ProjectMembers" ? (
                        <div>
                            <ul className="mb-3 space-y-2">
                                {membersList.map((member, idx) => (
                                    <li
                                        key={idx}
                                        className="flex justify-between items-center border p-2 rounded"
                                    >
                                        {member}
                                        <button
                                            onClick={() => handleRemoveMember(member)}
                                            className="text-red-500 hover:underline"
                                        >
                                            Remove
                                        </button>
                                    </li>
                                ))}
                            </ul>

                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="New member name"
                                    value={newMember}
                                    onChange={(e) => setNewMember(e.target.value)}
                                    className="border border-gray-400 rounded p-2 flex-1"
                                />
                                <button
                                    className="bg-green-500 text-white px-3 py-2 rounded"
                                    onClick={handleAddMember}
                                    type="button"
                                >
                                    Add
                                </button>
                            </div>
                        </div>
                    ) : editingField === "ProjectCategory" ? (
                        <select
                            value={fieldValue}
                            onChange={(e) => setFieldValue(e.target.value)}
                            className="border border-gray-400 rounded p-2 w-full"
                        >
                            <option value="">Select a Category</option>
                            {projectCategories.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <input
                            type="text"
                            value={fieldValue}
                            onChange={(e) => setFieldValue(e.target.value)}
                            className="border border-gray-400 rounded p-2 w-full"
                        />
                    )}

                    <div className="flex justify-end gap-2 mt-4">
                        <button
                            className="bg-gray-400 text-white px-4 py-2 rounded"
                            onClick={() => setInnerOpen(false)}
                        >
                            Cancel
                        </button>
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                            onClick={handleSave}
                        >
                            Save
                        </button>
                    </div>
                </DialogContent>
            </Dialog>
        </main>
    );
};

export default EditProject;
