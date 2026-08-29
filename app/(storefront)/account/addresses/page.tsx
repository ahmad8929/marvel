"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-client";
import { Button, Input, Label } from "@/components/ui";

type Address = {
  id: string;
  fullName: string;
  phone: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
};

const EMPTY = {
  fullName: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  pincode: "",
};

export default function AddressesPage() {
  const { authFetch } = useAuth();
  const [list, setList] = useState<Address[]>([]);
  const [form, setForm] = useState(EMPTY);
  const [adding, setAdding] = useState(false);

  const load = () =>
    authFetch("/addresses")
      .then((r) => (r.ok ? r.json() : { data: [] }))
      .then((j) => setList(j.data ?? []))
      .catch(() => undefined);

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const res = await authFetch("/addresses", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...form, line2: form.line2 || undefined }),
    });
    if (res.ok) {
      setForm(EMPTY);
      setAdding(false);
      void load();
    }
  }

  async function remove(id: string) {
    await authFetch(`/addresses/${id}`, { method: "DELETE" });
    void load();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl text-primary">Saved addresses</h2>
        <Button size="sm" variant="outline" onClick={() => setAdding((v) => !v)}>
          {adding ? "Cancel" : "Add address"}
        </Button>
      </div>

      {adding && (
        <form onSubmit={save} className="space-y-3 rounded-xl border border-line bg-surface p-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label>Full name</Label>
              <Input required value={form.fullName} onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))} />
            </div>
            <div>
              <Label>Phone</Label>
              <Input required value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
            </div>
          </div>
          <div>
            <Label>Address line 1</Label>
            <Input required value={form.line1} onChange={(e) => setForm((f) => ({ ...f, line1: e.target.value }))} />
          </div>
          <div>
            <Label>Address line 2</Label>
            <Input value={form.line2} onChange={(e) => setForm((f) => ({ ...f, line2: e.target.value }))} />
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <Label>City</Label>
              <Input required value={form.city} onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))} />
            </div>
            <div>
              <Label>State</Label>
              <Input required value={form.state} onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))} />
            </div>
            <div>
              <Label>Pincode</Label>
              <Input
                required
                value={form.pincode}
                onChange={(e) => setForm((f) => ({ ...f, pincode: e.target.value.replace(/\D/g, "").slice(0, 6) }))}
              />
            </div>
          </div>
          <Button type="submit" size="sm">
            Save address
          </Button>
        </form>
      )}

      {list.length === 0 ? (
        <p className="text-sm text-muted">No saved addresses.</p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {list.map((a) => (
            <li key={a.id} className="rounded-xl border border-line bg-surface p-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="font-medium">{a.fullName}</span>
                {a.isDefault && (
                  <span className="rounded-full bg-blush px-2 py-0.5 text-xs text-primary">
                    Default
                  </span>
                )}
              </div>
              <p className="mt-1 text-muted">
                {a.line1}
                {a.line2 ? `, ${a.line2}` : ""}
                <br />
                {a.city}, {a.state} - {a.pincode}
                <br />
                {a.phone}
              </p>
              <button
                onClick={() => remove(a.id)}
                className="mt-2 text-xs text-muted hover:text-sale"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
