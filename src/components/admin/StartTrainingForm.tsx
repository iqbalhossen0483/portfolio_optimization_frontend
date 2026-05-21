"use client";

import { AlertMessage } from "@/components/ui/AlertMessage";
import { Button } from "@/components/ui/Button";
import { Collapsible } from "@/components/ui/Collapsible";
import { FileUpload } from "@/components/ui/FileUpload";
import { Input } from "@/components/ui/Input";
import { RadioGroup } from "@/components/ui/RadioGroup";
import { Select } from "@/components/ui/Select";
import { trainingSchema, type TrainingSchema } from "@/lib/validators/training";
import { useStartTrainingMutation } from "@/store/api";
import { useAppDispatch } from "@/store/hooks";
import { addJob } from "@/store/slices/trainingSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { DateRangeInputs } from "./DateRangeInputs";

const defaultValues: TrainingSchema = {
  portfolioModel: "A",
  topology: "cooperative",
  trainStart: "",
  trainEnd: "",
  valStart: "",
  valEnd: "",
  alpha1: 0.33,
  alpha2: 0.33,
  alpha3: 0.05,
  beta: 0.5,
  lam: 0.5,
};

export function StartTrainingForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [files, setFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [startTraining] = useStartTrainingMutation();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<TrainingSchema>({
    resolver: zodResolver(trainingSchema),
    defaultValues,
  });

  const onSubmit = async (data: TrainingSchema) => {
    setError(null);
    setFileError(null);
    if (files.length === 0) {
      setFileError("Upload at least one .xlsx file.");
      return;
    }
    const formData = new FormData();
    for (const file of files) formData.append("files", file);
    formData.append("portfolio_model", data.portfolioModel);
    formData.append("topology", data.topology);
    if (data.trainStart) formData.append("train_start", data.trainStart);
    if (data.trainEnd) formData.append("train_end", data.trainEnd);
    if (data.valStart) formData.append("val_start", data.valStart);
    if (data.valEnd) formData.append("val_end", data.valEnd);
    formData.append(
      "hyperparams_json",
      JSON.stringify({
        alpha_1: data.alpha1,
        alpha_2: data.alpha2,
        alpha_3: data.alpha3,
        beta: data.beta,
        lam: data.lam,
      }),
    );

    try {
      const { data: res } = await startTraining(formData).unwrap();
      dispatch(addJob(res.job_id));
      router.push(`/admin/training/${res.job_id}`);
    } catch {
      setError("Failed to start training. Please try again.");
    }
  };

  const topology = useWatch({ control, name: "topology" });
  const trainStart = useWatch({ control, name: "trainStart" });
  const trainEnd = useWatch({ control, name: "trainEnd" });
  const valStart = useWatch({ control, name: "valStart" });
  const valEnd = useWatch({ control, name: "valEnd" });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <FileUpload
        label="Training Data (XLSX)"
        accept=".xlsx"
        multiple
        files={files}
        onChange={(next) => {
          setFiles(next);
          if (next.length > 0) setFileError(null);
        }}
        error={fileError ?? undefined}
      />

      <Controller
        name="portfolioModel"
        control={control}
        render={({ field }) => (
          <RadioGroup
            name="portfolioModel"
            label="Portfolio Model"
            value={field.value}
            onChange={field.onChange}
            options={[
              { value: "A", label: "Model A" },
              { value: "B", label: "Model B" },
              { value: "C", label: "Model C" },
            ]}
          />
        )}
      />

      <Select
        label="Topology"
        value={topology}
        onChange={(e) =>
          setValue("topology", e.target.value as TrainingSchema["topology"])
        }
        options={[
          { value: "cooperative", label: "Cooperative" },
          { value: "competitive", label: "Competitive" },
          { value: "mixed", label: "Mixed" },
          { value: "all", label: "All" },
        ]}
      />

      <DateRangeInputs
        trainStart={trainStart ?? ""}
        trainEnd={trainEnd ?? ""}
        valStart={valStart ?? ""}
        valEnd={valEnd ?? ""}
        onChange={(field, value) =>
          setValue(field as keyof TrainingSchema, value)
        }
      />

      <Collapsible title="Advanced Options">
        <div className="grid grid-cols-2 gap-3 mt-3">
          {(
            [
              { name: "alpha1", label: "α₁" },
              { name: "alpha2", label: "α₂" },
              { name: "alpha3", label: "α₃" },
              { name: "beta", label: "β" },
              { name: "lam", label: "λ" },
            ] as const
          ).map(({ name, label }) => (
            <Input
              key={name}
              label={label}
              type="number"
              step="0.01"
              error={errors[name]?.message}
              {...register(name, { valueAsNumber: true })}
            />
          ))}
        </div>
      </Collapsible>

      {error && <AlertMessage message={error} />}

      <Button type="submit" loading={isSubmitting} className="w-full">
        Start Training
      </Button>
    </form>
  );
}
