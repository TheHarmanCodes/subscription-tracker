import mongoose from "mongoose";
import dayjs from "dayjs";

const subscriptionSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Subscription name is required"],
            trim: true,
            minLength: 2,
            maxLength: 100,
        },
        price: {
            type: Number,
            required: [true, "Subscription price is required"],
            min: [0, "Price cannot be negative"],
        },
        currency: {
            type: String,
            enum: ["EUR", "USD", "INR"],
            default: "INR",
        },
        frequency: {
            type: String,
            enum: ["daily", "weekly", "monthly", "yearly"],
            required: [true, "Frequency is required"],
        },
        category: {
            type: String,
            enum: [
                "sports",
                "news",
                "entertainment",
                "lifestyle",
                "technology",
                "finance",
                "other",
            ],
            required: true,
        },
        paymentMethod: {
            type: String,
            required: [true, "PaymentMethods is required"],
            trim: true,
        },
        status: {
            type: String,
            enum: ["active", "inactive", "cancelled", "expired"],
            default: "active",
        },
        startDate: {
            type: Date,
            required: true,
            validate: {
                validator: (value) => value <= new Date(),
                message: "Start date cannot be in the future",
            },
        },
        renewalDate: {
            type: Date,
            validate: {
                validator: function (value) {
                    return value > this.startDate;
                },
                message: "Renewal date must be after the start date",
            },
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        workflowRunId: {
            type: String,
            trim: true,
        },
    },
    {timestamps: true},
);

// auto calculate renewal data if not specified
subscriptionSchema.pre("save", async function () {
    if (!this.renewalDate) {
        if (!this.frequency) {
            throw new Error("Frequency is required to calculate renewal date");
        }
        const renewalDate = dayjs(this.startDate);
        switch (this.frequency) {
            case "daily":
                this.renewalDate = renewalDate.add(1, "day").toDate();
                break;
            case "weekly":
                this.renewalDate = renewalDate.add(1, "week").toDate();
                break;
            case "monthly":
                this.renewalDate = renewalDate.add(1, "month").toDate();
                break;
            case "yearly":
                this.renewalDate = renewalDate.add(1, "year").toDate();
                break;
        }
        // the below logic is unable to calculate A February subscription or a leap-year renewal will have incorrect dates.
        // const renewalPeriods = {
        //   daily: 1,
        //   weekly: 7,
        //   monthly: 30,
        //   yearly: 365,
        // };
        // this.renewalDate = new Date(this.startDate);
        // this.renewalDate.setDate(
        //   this.renewalDate.getDate() + renewalPeriods[this.frequency],
        // );
    }
    // auto update the status if renewal date has passed
    if (this.renewalDate < new Date() && (this.status === "active" || this.status === "inactive")) {
        this.status = "expired";
    }
});

const Subscription = mongoose.model("Subscription", subscriptionSchema);
export default Subscription;
