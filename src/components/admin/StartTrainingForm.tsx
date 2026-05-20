"use client";

import { useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";
import { addJob } from "@/store/slices/trainingSlice";
import { useStartTrainingMutation } from "@/store/api";
import { trainingSchema, type TrainingSchema } from "@/lib/validators/training";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { RadioGroup } from "@/components/ui/RadioGroup";
import { Collapsible } from "@/components/ui/Collapsible";
import { FileUpload } from "@/components/ui/FileUpload";
import { AlertMessage } from "@/components/ui/AlertMessage";
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
  const [files, setFiles] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [startTraining] = useStartTrainingMutation();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<TrainingSchema>({
    resolver: zodResolver(trainingSchema),
    defaultValues,
  });

  const onSubmit = async (data: TrainingSchema) => {
    setError(null);
    const formData = new FormData();
    if (files) formData.append("file", files);
    formData.append("portfolio_model", data.portfolioModel);
    formData.append("topology", data.topology);
    if (data.trainStart) formData.append("train_start", data.trainStart);
    if (data.trainEnd) formData.append("train_end", data.trainEnd);
    if (data.valStart) formData.append("val_start", data.valStart);
    if (data.valEnd) formData.append("val_end", data.valEnd);
    formData.append("alpha1", String(data.alpha1));
    formData.append("alpha2", String(data.alpha2));
    formData.append("alpha3", String(data.alpha3));
    formData.append("beta", String(data.beta));
    formData.append("lam", String(data.lam));

    try {
      const res = await startTraining(formData).unwrap();
      dispatch(addJob(res.job_id));
      router.push(`/admin/training/${res.job_id}`);
    } catch {
      setError("Failed to start training. Please try again.");
    }
  };

  const topology = watch("topology");
  const portfolioModel = watch("portfolioModel");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <FileUpload
        label="Training Data (XLSX)"
        accept=".xlsx"
        onChange={setFiles}
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
        trainStart={watch("trainStart") ?? ""}
        trainEnd={watch("trainEnd") ?? ""}
        valStart={watch("valStart") ?? ""}
        valEnd={watch("valEnd") ?? ""}
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
